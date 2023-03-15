const { existsSync, mkdirSync } = require('fs')
const { nodeCheck } = require('./lib/node-check')
const { getConfig } = require('./lib/config')
const { run } = require('./lib/run')
const { download } = require('./lib/download')
const { getBaseRepoFromGit, getMainReposFromGit, installRepos, buildAssets } = require('./lib/main-repos')
const { generateBaseComposerRequirements } = require('./lib/composer-requirements')
const { createDatabase, importDatabase, useDatabase } = require('./lib/mysql')
const { createHtaccess, makeDirStructure, installPluginsDependencies } = require('./lib/utils')

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
 * Start WP
 */
makeDirStructure(config)
run('wp-env stop || true')
run('wp-env start')
createHtaccess(config)

/**
 * Install main repos
 */
console.log('Cloning base repo ...')
getBaseRepoFromGit(config)

console.log('Cloning and installing main repos ...')
getMainReposFromGit(config)
installRepos(config)

console.log('Generating assets ...')
buildAssets(config)

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
run(`unzip -qo content/${imagesDump} -d ${config.uploadsDir}`)

/**
 * Database
 */
console.log('Importing default database ...')
if (!existsSync('content')) {
  mkdirSync('content')
}
const dbName = 'planet4_dev'
const dbDump = `planet4-defaultcontent_wordpress-${config.planet4.content.db}.sql.gz`
download(
  `https://storage.googleapis.com/planet4-default-content/${dbDump}`,
  `content/${dbDump}`
)
createDatabase(dbName)
importDatabase(`content/${dbDump}`, dbName)
useDatabase(dbName)
run('wp-env run cli plugin activate --all')
run('wp-env run cli user update admin --user_pass=admin --role=administrator')

console.log('Ready !')
