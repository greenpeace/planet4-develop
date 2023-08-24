const { nodeCheck } = require('./lib/env-check')
const { getConfig } = require('./lib/config')
const { run } = require('./lib/run')
const { getMainReposFromRelease, installRepos } = require('./lib/main-repos')
const { isRepo, isDir } = require('./lib/utils')

/**
 * Node version control
 */
console.log('Node version: ' + process.version)
nodeCheck()

/**
 * Config
 */
const config = getConfig()
console.log(process.cwd(), '\n', config)

// self - and rerun ?
if (isRepo(process.cwd())) {
  run('git pull || true', { cwd: `${process.cwd()}` })
}

// base dir
// reinstall dependencies ?
if (isRepo(`${config.paths.local.app}/planet4-base`)) {
  run('git pull || true', { cwd: `${config.paths.local.app}/planet4-base` })
}

// main repos
if (isRepo(`${config.paths.local.themes}/planet4-master-theme`)
  && isRepo(`${config.paths.local.plugins}/planet4-plugin-gutenberg-blocks`)
) {
  run('git pull || true', { cwd: `${config.paths.local.themes}/planet4-master-theme` })
  run('git pull || true', { cwd: `${config.paths.local.plugins}/planet4-plugin-gutenberg-blocks` })
  installRepos(config)
} else if (isDir(`${config.paths.local.themes}/planet4-master-theme`)
  && isDir(`${config.paths.local.plugins}/planet4-plugin-gutenberg-blocks`)
) {
  getMainReposFromRelease(config, true)
  installRepos(config)
}

// default images
// default DB

run('npx wp-env stop || true')
run('npx wp-env start --update')
