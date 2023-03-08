const { existsSync, lstatSync } = require('fs');
const { getConfig } = require('./lib/config');
const { run } = require('./lib/run');

/**
 * Config
 */
const config = getConfig();
console.log(process.cwd(), config);
if (!config.nro) {
  console.log('Please specify NRO name by using .p4-env.json file');
  process.exit(1);
}

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
  run(`wp-env run cli theme activate ${themeName}`);
}
/**
 * Database
 */
// @todo:
// - Switch DB
// - Add reverse proxy
