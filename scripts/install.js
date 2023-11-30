const {nodeCheck} = require('./lib/env-check');
const {getConfig} = require('./lib/config');
const {run, composer, wp} = require('./lib/run');
const {download} = require('./lib/download');
const {getBaseRepoFromGit, getMainReposFromGit, installRepos, buildAssets, setComposerConfig} = require('./lib/main-repos');
const {generateBaseComposerRequirements} = require('./lib/composer-requirements');
const {importDefaultContent} = require('./lib/db-defaultcontent');
const {createHtaccess, makeDirStructure, installPluginsDependencies} = require('./lib/utils');

/**
 * Node version control
 */
console.log('Node version: ' + process.version);
nodeCheck();

/**
 * Config
 */
const config = getConfig();
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
 * Merge composer requirements
 */
console.log('Merging composer requirements ...');
generateBaseComposerRequirements(config);

/**
 * Install themes/plugins
 */
console.log('Installing & activating plugins ...');
composer('update', config.paths.container.app);
installPluginsDependencies(config);

/**
 * Install development requirements
 */
console.log('Installing development requirements ...');
run('cp -n .wp-env.override.json.dist .wp-env.override.json');

/**
 * Images
 */
const imagesDump = `planet4-default-content-${config.planet4.content.images}-images.zip`;
download(
  `https://storage.googleapis.com/planet4-default-content/${imagesDump}`,
  `content/${imagesDump}`
);
run(`unzip -qo content/${imagesDump} -d ${config.paths.local.uploads}`);

/**
 * Database
 */
console.log('Importing default database ...');
importDefaultContent(config.planet4.content.db);

/**
 * Activate plugins
 */
wp('plugin activate --all');
wp('plugin deactivate elasticpress');
run('npx wp-env run cli wp plugin install query-monitor');

console.log(
  `The local instance is now available at ${config.config.WP_SITEURL}`
);
