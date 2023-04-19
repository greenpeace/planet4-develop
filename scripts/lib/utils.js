const { existsSync, lstatSync, readdirSync, readFileSync, writeFileSync } = require('fs')
const { run } = require('./run')
const yaml = require('js-yaml')

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

function makeDirStructure ({ themesDir, pluginsDir, uploadsDir, languagesDir }) {
  run(`mkdir -p ${themesDir} && mkdir -p ${pluginsDir} && mkdir -p ${uploadsDir} && mkdir -p ${languagesDir} && mkdir -p content`)
}

function installPluginsDependencies ({ pluginsDir }) {
  const excluded = ['cmb2']
  const files = readdirSync(pluginsDir)

  files.forEach((file) => {
    const path = `${pluginsDir}/${file}`
    if (excluded.includes(file)
      || !isDir(path)
      || !existsSync(`${path}/composer.json`)
      || isDir(`${path}/vendor`)
    ) {
      return
    }

    run(`wp-env run composer -d /app/${path} update -n --ignore-platform-reqs`)
  })
}

function createHtaccess (config) {
  const htaccessTemplate = require('../.htaccess.tpl.js')
  const content = htaccessTemplate(config.nro?.imgBucket || null)
  writeFileSync(`${config.appDir}/.htaccess`, content)
  run(`docker compose -f $(wp-env install-path)/docker-compose.yml cp ${config.appDir}/.htaccess wordpress:/var/www/html/.htaccess`)
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

module.exports = {
  isDir,
  isRepo,
  cloneIfNotExists,
  makeDirStructure,
  installPluginsDependencies,
  createHtaccess,
  readYaml
}
