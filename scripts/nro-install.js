const { nodeCheck } = require('./lib/node-check')
const { getConfig } = require('./lib/config')
const { run } = require('./lib/run')
const { getMainReposFromRelease, installRepos } = require('./lib/main-repos')
const { generateBaseComposerRequirements, generateNROComposerRequirements } = require('./lib/composer-requirements')
const { makeDirStructure, cloneIfNotExists } = require('./lib/utils')
const { createDatabase, importDatabase, databaseExists, useDatabase } = require('./lib/mysql')
const { basename } = require('path')

/**
 * Node version control
 */
console.log('Node version: ' + process.version)
nodeCheck()

/**
 * Config
 */
const nroOverride = process.argv[2] || null
const config = getConfig(nroOverride ? { name: nroOverride } : null)
console.log(process.cwd(), '\n', config)
if (!config.nro) {
  console.log('Please specify NRO name by using .p4-env.json file')
  process.exit(1)
}

/**
 * Install main repos
 */
makeDirStructure(config)
console.log('Cloning base repo ...')
cloneIfNotExists(config.baseDir, 'git@github.com:greenpeace/planet4-base.git')

console.log('Fetching main repos ...')
getMainReposFromRelease(config)
installRepos(config)

/**
 * Clone NRO deployment repo
 */
console.log('Cloning deployment repo ...')
cloneIfNotExists(config.nro.dir, `git@github.com:greenpeace/${config.nro.repo}.git`)

/**
 * Start WP
 */
run('wp-env stop')
run('wp-env start')

/**
 * Merge base composer requirements
 */
console.log('Merging base composer requirements ...')
generateBaseComposerRequirements(config)

/**
 * Merge NRO composer requirements with base
 */
console.log('Merging NRO composer requirements ...')
const composerConfig = generateNROComposerRequirements(config)
const keys = Object.keys(composerConfig.require || {}).filter(k => k.startsWith('greenpeace/planet4-child-theme-'))
const theme = keys[0] || null

/**
 * Install NRO theme & plugins
 */
let themeName = null
if (theme) {
  themeName = theme.replace('greenpeace/', '')
  const themePath = `${config.themesDir}/${themeName}`
  cloneIfNotExists(themePath, `git@github.com:${theme}.git`)
  run(`wp-env run composer -d /app/${config.appDir}/ remove --no-update ${theme}`)
}

run(`wp-env run composer -d /app/${config.appDir}/ update --ignore-platform-reqs`)
if (themeName) {
  run(`wp-env run cli theme activate ${themeName}`)
}

/**
 * Database
 */
// @todo:
// - Add reverse proxy
if (databaseExists(config.nro.db)) {
  console.log(`Database ${config.nro.db} already exists, skipping database import.`)
  useDatabase(config.nro.db)
  if (themeName) {
    run(`wp-env run cli theme activate ${themeName}`)
  }
  process.exit(0)
}

createDatabase(config.nro.db)
const dumpList = String.fromCharCode(
  ...run(`gsutil ls -rl "gs://${config.nro.dbBucket}/**" | sort -k2`, { stdio: 'pipe' })
).trim().split(/\r?\n/)
const dumpUrl = dumpList[dumpList.length - 2].trim().split('  ')[2] || null
if (dumpUrl) {
  console.log(`Dump found: ${dumpUrl}`)
  const dumpName = basename(dumpUrl)
  run(`gsutil cp ${dumpUrl} content/`)
  importDatabase(`content/${dumpName}`, config.nro.db)
  useDatabase(config.nro.db)
}
run('wp-env run cli user update admin --user_pass=admin --role=administrator')
if (themeName) {
  run(`wp-env run cli theme activate ${themeName}`)
}
