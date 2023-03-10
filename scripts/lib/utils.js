const { existsSync, lstatSync, readdirSync } = require('fs')
const { run } = require('./run')

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

function makeDirStructure ({ themesDir, pluginsDir, uploadsDir }) {
  run(`mkdir -p ${themesDir} && mkdir -p ${pluginsDir} && mkdir -p ${uploadsDir}`)
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

    run(`wp-env run composer -d /app/${path} update --ignore-platform-reqs`)
  })
}

module.exports = {
  isDir,
  isRepo,
  cloneIfNotExists,
  makeDirStructure,
  installPluginsDependencies
}
