const { existsSync, mkdirSync } = require('fs')
const { nodeCheck } = require('./lib/node-check')
const { getConfig } = require('./lib/config')
const { run } = require('./lib/run')
const { download } = require('./lib/download')
const { getMainReposFromGit, installRepos, buildAssets } = require('./lib/main-repos')
const { generateBaseComposerRequirements } = require('./lib/composer-requirements')
const { createDatabase, importDatabase, useDatabase } = require('./lib/mysql')
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

/**
 * Install main repos
 */
makeDirStructure(config)
console.log('Cloning base repo ...')
cloneIfNotExists(config.baseDir, 'git@github.com:greenpeace/planet4-base.git')

console.log('Cloning and installing main repos ...')
getMainReposFromGit(config)
installRepos(config)

console.log('Generating assets ...')
buildAssets(config)

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
run('wp-env run cli plugin activate --all')

/**
 * Images
 */
const imagesDump = 'planet4-default-content-1-25-images.zip'
download(
  `https://storage.googleapis.com/planet4-default-content/${imagesDump}`,
  `content/${imagesDump}`
)
run(`unzip -qo content/${imagesDump} -d ${config.uploadsDir}`)

/**
 * Database
 */
console.log('Importing default database ...')
if (!existsSync('content')) {
  mkdirSync('content')
}
const dbName = 'planet4_dev'
const dbDump = 'planet4-defaultcontent_wordpress-v0.2.13.sql.gz'
download(
  `https://storage.googleapis.com/planet4-default-content/${dbDump}`,
  `content/${dbDump}`
)
createDatabase(dbName)
importDatabase(`content/${dbDump}`, dbName)
useDatabase(dbName)
run('wp-env run cli user update admin --user_pass=admin --role=administrator')

console.log('Ready !')
