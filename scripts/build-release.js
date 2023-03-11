const { existsSync, mkdirSync } = require('fs')
const { nodeCheck } = require('./lib/node-check')
const { getConfig } = require('./lib/config')
const { run } = require('./lib/run')
const { download } = require('./lib/download')
const { getMainReposFromRelease, installRepos } = require('./lib/main-repos')
const { generateBaseComposerRequirements } = require('./lib/composer-requirements')
const { makeDirStructure, cloneIfNotExists, installPluginsDependencies } = require('./lib/utils')

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

if (!existsSync('content')) {
  mkdirSync('content')
}

/**
 * Install main repos
 */
makeDirStructure(config)
console.log('Cloning base repo ...')
cloneIfNotExists(config.baseDir, 'https://github.com/greenpeace/planet4-base.git')

console.log('Cloning and installing main repos ...')
getMainReposFromRelease(config)
installRepos(config)

/**
 * Start WP
 */
run('wp-env stop')
run('wp-env start')

/**
 * Merge composer requirements
 */
console.log('Merging composer requirements ...')
generateBaseComposerRequirements(config)

/**
 * Install themes/plugins
 */
console.log('Installing & activating plugins ...')
run(`wp-env run composer -d /app/${config.appDir}/ update --ignore-platform-reqs`)
installPluginsDependencies(config)

/**
 * Images
 */
const imagesDump = `planet4-default-content-${config.planet4.content.images}-images.zip`
download(
  `https://storage.googleapis.com/planet4-default-content/${imagesDump}`,
  `content/${imagesDump}`
)

/**
 * Database
 */
console.log('Downloading default database ...')
const dbDump = `planet4-defaultcontent_wordpress-${config.planet4.content.db}.sql.gz`
download(
  `https://storage.googleapis.com/planet4-default-content/${dbDump}`,
  `content/${dbDump}`
)
