const { nodeCheck } = require('./lib/node-check')
const { getConfig } = require('./lib/config')
const { run } = require('./lib/run')
const { getBaseRepoFromGit, getMainReposFromRelease, installRepos } = require('./lib/main-repos')
const { generateBaseComposerRequirements, generateNROComposerRequirements } = require('./lib/composer-requirements')
const { createHtaccess, makeDirStructure, cloneIfNotExists, installPluginsDependencies, readYaml } = require('./lib/utils')
const { createDatabase, importDatabase, databaseExists, useDatabase } = require('./lib/mysql')
const { basename } = require('path')
const { existsSync } = require('fs')

/**
 * Node version control
 */
console.log('Node version: ' + process.version)
nodeCheck()

/**
 * Config
 */
const nroOverride = process.argv[2] || null
const config = getConfig(nroOverride ? { nro: { name: nroOverride } } : null)
console.log(process.cwd(), '\n', config)
if (!config.nro) {
  console.log('Please specify NRO name by using .p4-env.json file')
  process.exit(1)
}

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

console.log('Fetching main repos ...')
getMainReposFromRelease(config)
installRepos(config)

/**
 * Clone NRO deployment repo
 */
console.log('Cloning deployment repo ...')
cloneIfNotExists(config.nro.dir, `https://github.com/greenpeace/${config.nro.repo}.git`)

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
  cloneIfNotExists(themePath, `https://github.com/${theme}.git`)
  run(`wp-env run composer -d /app/${config.appDir}/ remove --no-update ${theme}`)

  if (existsSync(`${themePath}/composer.json`)) {
    run(`wp-env run composer -d /app/${themePath}/ update --ignore-platform-reqs`)
  }
}

run(`wp-env run composer -d /app/${config.appDir}/ update --ignore-platform-reqs`)
installPluginsDependencies(config)
if (themeName) {
  run(`wp-env run cli theme activate ${themeName}`)
}

/**
 * Use CI config
 */
const ciConfig = readYaml(`${config.nro.dir}/.circleci/config.yml`)

/**
 * Database
 */
if (databaseExists(config.nro.db)) {
  console.log(`Database ${config.nro.db} already exists, skipping database import.`)
  useDatabase(config.nro.db)
  if (themeName) {
    run(`wp-env run cli theme activate ${themeName}`)
  }

  console.log(`The local instance is now available at ${config.config.WP_SITEURL}`)
  process.exit(0)
}

// Create and import database
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

// Create/update admin user
run('wp-env run cli user update admin --user_pass=admin --role=administrator')
if (themeName) {
  run(`wp-env run cli theme activate ${themeName}`)
}

// Detect and replace original URL
if (ciConfig) {
  const host = ciConfig.job_environments.production_environment.APP_HOSTNAME || null
  const path = ciConfig.job_environments.common_environment.APP_HOSTPATH || null
  const nroUrl = `https://${host}/${path || ''}`
  const newUrl = config.config.WP_SITEURL
  run(`wp-env run cli search-replace ${nroUrl} ${newUrl} --precise --skip-columns=guid`)
}

console.log(`The local instance is now available at ${config.config.WP_SITEURL}`)
