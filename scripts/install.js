const { existsSync, lstatSync, mkdirSync } = require('fs');
const { nodeCheck } = require('./lib/node-check');
const { getConfig } = require('./lib/config');
const { run } = require('./lib/run');
const { getMainReposFromGit, installRepos, buildAssets } = require('./lib/main-repos');
const { generateBaseComposerRequirements } = require('./lib/composer-requirements');
const { createDatabase, importDatabase } = require('./lib/mysql');

/**
 * Node version control
 */
console.log('Node version: ' + process.version);
nodeCheck();

/**
 * Config
 */
const config = getConfig();
console.log(process.cwd(), config);

/**
 * Install main repos
 */
console.log('Cloning base repo ...');
existsSync(`${config.baseDir}`) && lstatSync(`${config.baseDir}`).isDirectory()
  ? run('git status', {cwd: `${config.baseDir}`})
  : run(`git clone git@github.com:greenpeace/planet4-base.git ${config.baseDir}`);

console.log('Cloning and installing main repos ...');
getMainReposFromGit(config);
installRepos(config);
console.log('Generating assets ...');
buildAssets(config);

/**
 * Start WP
 */
run('wp-env stop');
run('wp-env start --update');

/**
 * Merge composer requirements
 */
console.log('Merging composer requirements ...');
generateBaseComposerRequirements(config);

/**
 * Install themes/plugins
 */
run(`wp-env run composer -d /app/${config.appDir}/ update --ignore-platform-reqs`);
console.log('Activating plugins ...');
run('wp-env run cli plugin activate --all');

/**
 * Database
 */
if (!existsSync('content')) {
    mkdirSync('content');
}
run('curl --fail https://storage.googleapis.com/planet4-default-content/planet4-defaultcontent_wordpress-v0.2.13.sql.gz > content/planet4-defaultcontent_wordpress-v0.2.13.sql.gz');

const dbName = 'planet4_dev';
createDatabase(dbName);
importDatabase('content/planet4-defaultcontent_wordpress-v0.2.13.sql.gz', dbName);

run(`wp-env run cli config set DB_NAME ${dbName}`);
run('wp-env run cli user update admin --user_pass=admin --role=administrator');
