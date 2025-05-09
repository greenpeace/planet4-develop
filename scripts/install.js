const {getConfig} = require('./lib/config');
const {run, runWithOutput, composer, wp} = require('./lib/run');
const {getBaseRepoFromGit, getMainReposFromGit, installRepos, buildAssets, setComposerConfig} = require('./lib/main-repos');
const {generateBaseComposerRequirements, generateNROComposerRequirements} = require('./lib/composer-requirements');
const {installPluginsDependencies, createHtaccess, makeDirStructure, cloneIfNotExists, readYaml} = require('./lib/utils');
const {createDatabase, importDatabase, databaseExists, useDatabase} = require('./lib/mysql');
const {importDefaultContent} = require('./lib/db-defaultcontent');
const {basename} = require('path');
const {existsSync} = require('fs');
const {download} = require('./lib/download');
const {createAdminUser} = require('./lib/admin-user');
const {configureHosts} = require('./lib/hosts');

/**
 * Configure hosts file
 */
console.log('Configure /etc/hosts file ...');
configureHosts();

/**
 * Config
 */
const nroOverride = process.argv[2] || null;
const config = getConfig(nroOverride ? {nro: {name: nroOverride}} : null);
console.log(process.cwd(), '\n', config);

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

console.log('Cloning and installing main repos ...');
getMainReposFromGit(config);
installRepos(config);

console.log('Generating assets ...');
buildAssets(config);

/**
 * Merge base composer requirements
 */
console.log('Merging base composer requirements ...');
generateBaseComposerRequirements(config);

/**
 * Install themes/plugins
 */
console.log('Installing & activating plugins ...');
run('npx wp-env run cli sudo mkdir -p /app/source/artifacts');
composer('update', config.paths.container.app);
installPluginsDependencies(config);

/**
 * Install development requirements
 */
console.log('Installing development requirements ...');
run('cp -n .wp-env.override.json.dist .wp-env.override.json || true');

/**
 * Run NRO deployment tasks
 */
if (config.nro) {
  // Clone NRO repo
  console.log('Cloning deployment repo ...');
  cloneIfNotExists(
    `${config.paths.local.app}/${config.nro.dir}`,
    `https://github.com/greenpeace/${config.nro.repo}.git`
  );

  // Merge NRO composer requirements with base
  console.log('Merging NRO composer requirements ...');
  const composerConfig = generateNROComposerRequirements(config);
  const keys = Object.keys(composerConfig.require || {}).filter(k =>
    k.startsWith('greenpeace/planet4-child-theme-')
  );
  const theme = keys[0] || null;

  // Install NRO theme & plugins
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
  if (themeName) {
    wp(`theme activate ${themeName}`);
  }
}

/**
 * Check if database is already imported
 */
let importDB = true;
let dbName = 'planet4_dev';
if (config.nro) {
  dbName = config.nro.db;
}
if (databaseExists(dbName)) {
  console.log(
    `Database ${dbName} already exists, skipping database import.`
  );
  useDatabase(dbName);
  importDB = false;
}

/**
 * Import database and fetch images
 */
if (importDB) {
  if (config.nro) {
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
          // Read CI config
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
        }
      }
    } catch (error) {
      console.log('Error trying to import NRO database.');
      if (process.env.VERBOSE) {
        console.log(error);
      }
    }
  } else {
    // Default content
    const imagesDump = `planet4-default-content-${config.planet4.content.images}-images.zip`;
    download(
      `https://storage.googleapis.com/planet4-default-content/${imagesDump}`,
      `content/${imagesDump}`
    );
    run(`unzip -qo content/${imagesDump} -d ${config.paths.local.uploads}`);
    console.log('Importing default database ...');
    importDefaultContent(config.planet4.content.db);
  }
}

// Create/update admin user
createAdminUser();

// Run custom scripts
composer('run-script site:custom', config.paths.container.app);

/**
 * Activate plugins
 */
wp('plugin activate --all');
wp('plugin deactivate elasticpress');
wp('option update sm_mode "ephemeral"');
run('npx wp-env run cli wp plugin install query-monitor');

console.log(
  `The local instance is now available at ${config.config.WP_SITEURL}`
);
