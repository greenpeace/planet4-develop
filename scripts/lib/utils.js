const { existsSync, lstatSync, readdirSync, readFileSync, writeFileSync } = require('fs')
const { run, composer } = require('./run')
const yaml = require('js-yaml')
const os = require('os')

function isDir (path) {
  return existsSync(path) && lstatSync(path).isDirectory()
}

function isRepo (path) {
  return isDir(path) && existsSync(`${path}/.git/info`)
}

function cloneIfNotExists (path, repo) {
  if (isRepo(path)) {
    run('git status', { cwd: path })
    return
  }

  if (isDir(path)) {
    console.log(`<${path}> is not a repository.`)
    return
  }

  run(`git clone ${repo} ${path}`)
}

function makeDirStructure (config) {
  run('mkdir -p content')
  Object.values(config.paths.local).forEach(dir => run(`mkdir -p ${dir}`))
}

function installPluginsDependencies (config) {
  const excluded = ['cmb2']
  const files = readdirSync(config.paths.local.plugins)

  files.forEach((file) => {
    const path = `${config.paths.local.plugins}/${file}`
    if (excluded.includes(file)
      || !isDir(path)
      || !existsSync(`${path}/composer.json`)
      || isDir(`${path}/vendor`)
    ) {
      return
    }

    composer('update -n', `${config.paths.container.plugins}/${file}`)
  })
}

function createHtaccess (config) {
  const htaccessTemplate = require('../.htaccess.tpl.js')
  const content = htaccessTemplate(config.nro?.imgBucket || null)
  writeFileSync(`${config.paths.local.app}/.htaccess`, content)
  run(`docker compose -f $(wp-env install-path)/docker-compose.yml cp ${config.paths.local.app}/.htaccess wordpress:/var/www/html/.htaccess`)
}

function readYaml (filePath) {
  try {
    const fileContent = readFileSync(filePath, 'utf8')
    const parsedYaml = yaml.load(fileContent)
    return parsedYaml
  } catch (err) {
    console.error('Error reading or parsing YAML:', err)
    return null
  }
}

function parseArgs (args, def) {
  const interpreter = args.shift()
  const script = args.shift()
  const options = args.filter(v => v.startsWith('--'))
  const commands = args.filter(v => !options.includes(v))
  const command = commands[0] || def?.command || null

  const parsed = {
    interpreter,
    script,
    command,
    options
  }

  if (process.env.VERBOSE) {
    console.log(parsed)
  }

  return parsed
}

// Cf. https://github.com/WordPress/gutenberg/blob/trunk/packages/env/lib/get-host-user.js
function getHostUser () {
  const hostUser = os.userInfo()
  const uid = (hostUser.uid === -1 ? 1000 : hostUser.uid).toString()
  const gid = (hostUser.gid === -1 ? 1000 : hostUser.gid).toString()
  return {
    name: hostUser.username,
    uid,
    gid,
    fullUser: uid + ':' + gid
  }
}

module.exports = {
  isDir,
  isRepo,
  cloneIfNotExists,
  makeDirStructure,
  installPluginsDependencies,
  createHtaccess,
  readYaml,
  parseArgs,
  getHostUser
}
