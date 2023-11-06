const {nodeCheck} = require('./lib/env-check');
const {getConfig} = require('./lib/config');
const {run, runWithOutput, composer, wp} = require('./lib/run');
const {getBaseRepoFromGit, getMainReposFromRelease, installRepos, setComposerConfig} = require('./lib/main-repos');
const {generateBaseComposerRequirements, generateNROComposerRequirements} = require('./lib/composer-requirements');
const {createHtaccess, makeDirStructure, cloneIfNotExists, readYaml} = require('./lib/utils');
const {createDatabase, importDatabase, databaseExists, useDatabase} = require('./lib/mysql');
const {basename} = require('path');
const {existsSync} = require('fs');

/**
 * Node version control
 */
console.log('Node version: ' + process.version);
nodeCheck();

/**
 * Config
 */
const nroOverride = process.argv[2] || null;
const config = getConfig(nroOverride ? {nro: {name: nroOverride}} : null);
console.log(process.cwd(), '\n', config);
if (!config.nro) {
  console.log('Please specify NRO name by using .p4-env.json file');
  process.exit(1);
}

/**
 * Start WP
 */
makeDirStructure(config);
run('npx wp-env stop || true');
run('npx wp-env start');
createHtaccess(config);

/**
 * Install main repos
 */
setComposerConfig(config);
console.log('Cloning base repo ...');
getBaseRepoFromGit(config);

console.log('Fetching main repos ...');
getMainReposFromRelease(config);
installRepos(config);

/**
 * Clone NRO deployment repo
 */
console.log('Cloning deployment repo ...');
cloneIfNotExists(
  `${config.paths.local.app}/${config.nro.dir}`,
  `https://github.com/greenpeace/${config.nro.repo}.git`
);

/**
 * Merge base composer requirements
 */
console.log('Merging base composer requirements ...');
generateBaseComposerRequirements(config);

/**
 * Merge NRO composer requirements with base
 */
console.log('Merging NRO composer requirements ...');
const composerConfig = generateNROComposerRequirements(config);
const keys = Object.keys(composerConfig.require || {}).filter(k =>
  k.startsWith('greenpeace/planet4-child-theme-')
);
const theme = keys[0] || null;

/**
 * Install NRO theme & plugins
 */
let themeName = null;
if (theme) {
  themeName = theme.replace('greenpeace/', '');
  const themePath = `${config.paths.local.themes}/${themeName}`;
  cloneIfNotExists(themePath, `https://github.com/${theme}.git`);
  composer(`remove --no-update ${theme}`, config.paths.container.app);

  if (existsSync(`${themePath}/composer.json`)) {
    composer('update', `${config.paths.container.themes}/${themeName}`);
  }
}

composer('update', config.paths.container.app);
// installPluginsDependencies(config)
if (themeName) {
  wp(`theme activate ${themeName}`);
}

/**
 * Database
 */
if (databaseExists(config.nro.db)) {
  console.log(
    `Database ${config.nro.db} already exists, skipping database import.`
  );
  useDatabase(config.nro.db);
  if (themeName) {
    wp(`theme activate ${themeName}`);
  }

  composer('run-script site:custom', config.paths.container.app);
  console.log(
    `The local instance is now available at ${config.config.WP_SITEURL}`
  );
  process.exit(0);
}

// Control gcloud login
try {
  const gcloudID = runWithOutput('gcloud auth list --filter=status:ACTIVE --format="value(account)" --verbosity="error"');
  if (!gcloudID.trim()) {
    console.log('\n', 'Gcloud account not logged in, skipping NRO database import.', '\n');
  } else {
    const dumpList = runWithOutput(`gcloud storage ls -r -l "gs://${config.nro.dbBucket}/**" | sort -k2`).split(/\r?\n/);
    const dumpUrl = dumpList[dumpList.length - 2].trim().split('  ')[2] || null;
    if (dumpUrl) {
      // Create and import database
      createDatabase(config.nro.db);
      console.log(`Dump found: ${dumpUrl}`);
      const dumpName = basename(dumpUrl);
      run(`gcloud storage cp ${dumpUrl} content/`);
      importDatabase(`content/${dumpName}`, config.nro.db);
      useDatabase(config.nro.db);
    }
  }
} catch (error) {
  console.log('Error trying to import NRO database.');
  if (process.env.VERBOSE) {
    console.log(error);
  }
}

// Create/update admin user
try {
  wp('user create admin admin@planet4.test --user_pass=admin --role=administrator');
} catch (error) {
  wp('user update admin --user_pass=admin --role=administrator');
}
if (themeName) {
  wp(`theme activate ${themeName}`);
}

// Run custom scripts
composer('run-script site:custom', config.paths.container.app);

/**
 * Use CI config
 */
const ciConfig = readYaml(
  `${config.paths.local.app}/${config.nro.dir}/.circleci/config.yml`
);

// Detect and replace original URL
if (ciConfig) {
  const host =
		ciConfig.job_environments.production_environment.APP_HOSTNAME || null;
  const path =
		ciConfig.job_environments.common_environment.APP_HOSTPATH || null;
  const nroUrl = `https://${host}/${path || ''}`;
  const newUrl = config.config.WP_SITEURL;
  wp(`search-replace ${nroUrl} ${newUrl} --precise --skip-columns=guid`);
}

console.log(
  `The local instance is now available at ${config.config.WP_SITEURL}`
);
