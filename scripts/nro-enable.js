const {getConfig} = require('./lib/config');
const {composer, wp} = require('./lib/run');
const {
  generateNROComposerRequirements,
} = require('./lib/composer-requirements');
const {cloneIfNotExists} = require('./lib/utils');

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
const composerConfig = generateNROComposerRequirements(config);
const keys = Object.keys(composerConfig.require || {}).filter(k =>
  k.startsWith('greenpeace/planet4-child-theme')
);
const theme = keys[0] || null;

/**
 * Install NRO theme & plugins
 */
let themeName = null;
if (theme) {
  themeName = theme.replace('greenpeace/', '');
  const themePath = `${config.themesDir}/${themeName}`;
  cloneIfNotExists(themePath, `https://github.com/${theme}.git`);
  composer(`remove --no-update ${theme}`, `/app/${config.paths.local.app}/`);
}

composer('update', `/app/${config.paths.local.app}/`);
if (themeName) {
  wp(`theme activate ${themeName}`);
}

/**
 * Database
 */
// @todo:
// - Switch DB
// - Add reverse proxy
