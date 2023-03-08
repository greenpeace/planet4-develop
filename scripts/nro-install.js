const { existsSync, lstatSync } = require('fs');
const { run } = require('./lib/run');
const { getConfig } = require('./lib/config');
const { nodeCheck } = require('./lib/node-check');
const { getMainReposFromRelease, installRepos } = require('./lib/main-repos');
const { generateBaseComposerRequirements, generateNROComposerRequirements } = require('./lib/composer-requirements');

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

const nro = config.nro || null;
if (!nro) {
  console.log('Please specify NRO name by using .p4-env.json file');
  exit(1);
}

/**
 * Install main repos
 */
console.log('Cloning base repo ...');
existsSync(`${config.baseDir}`) && lstatSync(`${config.baseDir}`).isDirectory()
  ? run('git status', {cwd: `${config.baseDir}`})
  : run(`git clone git@github.com:greenpeace/planet4-base.git ${config.baseDir}`);

console.log('Fetching main repos ...');
getMainReposFromRelease(config);
installRepos(config)

/**
 * Install NRO deployment repo
 */
const nroDir = `${config.appDir}/${config.nro.repo}`;
console.log('Cloning deployment repo ...');
existsSync(`${nroDir}`) && lstatSync(`${nroDir}`).isDirectory()
  ? run('git status', {cwd: `${nroDir}`})
  : run(`git clone git@github.com:greenpeace/${config.nro.repo}.git ${nroDir}`);

/**
 * Start WP
 */
run('wp-env stop');
run('wp-env start --update');

/**
 * Merge composer requirements
 */
console.log('Merging base composer requirements ...');
generateBaseComposerRequirements(config);

/**
 * Merge NRO composer requirements with base
 */
console.log('Merging NRO composer requirements ...');
composerConfig = generateNROComposerRequirements(config);
const keys = Object.keys(composerConfig.require || {}).filter(k => k.startsWith('greenpeace/planet4-child-theme'))
const nroTheme = keys[0] || null;

/**
 * Install NRO theme & plugins
 */
let themeName = null;
if (nroTheme) {
  themeName = nroTheme.replace('greenpeace/', '');
  const themePath = `${config.themesDir}/${themeName}`;

  existsSync(`${themePath}`) && lstatSync(`${themePath}`).isDirectory()
    ? run('git status', {cwd: `${themePath}`})
    : run(`git clone git@github.com:${nroTheme}.git ${themePath}`);

  run(`wp-env run composer -d /app/${config.appDir}/ remove --no-update ${nroTheme}`);
}

run(`wp-env run composer -d /app/${config.appDir}/ update --ignore-platform-reqs`);
if (themeName) {
  run(`wp-env cli theme activate ${themeName}`);
}

/**
 * Database
 */
// @todo:
// - Fetch DB
// - Switch DB
// - Add reverse proxy
