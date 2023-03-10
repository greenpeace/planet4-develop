const { nodeCheck } = require('./lib/node-check')
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

// self ? and rerun
// base dir
// main repos
// default DB
// default images

if (isRepo(process.cwd())) {
  run('git pull || true', { cwd: `${process.cwd()}` })
}

if (isRepo(config.baseDir)) {
  run('git pull || true', { cwd: `${config.baseDir}` })
}

if (isRepo(`${config.themesDir}/planet4-master-theme`)
  && isRepo(`${config.pluginsDir}/planet4-plugin-gutenberg-blocks`)
) {
  run('git pull || true', { cwd: `${config.themesDir}/planet4-master-theme` })
  run('git pull || true', { cwd: `${config.pluginsDir}/planet4-plugin-gutenberg-blocks` })
  installRepos(config)
} else if (isDir(`${config.themesDir}/planet4-master-theme`)
  && isDir(`${config.pluginsDir}/planet4-plugin-gutenberg-blocks`)
) {
  getMainReposFromRelease(config, true)
  installRepos(config)
}
