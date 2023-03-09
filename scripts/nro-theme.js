const { nodeCheck } = require('./lib/node-check');
const { getConfig } = require('./lib/config');
const { run } = require('./lib/run');
const { cloneIfNotExists } = require('./lib/utils');
const { getNroComposerRequirements } = require('./lib/composer-requirements');

/**
 * Node version control
 */
console.log('Node version: ' + process.version);
nodeCheck();

/**
 * Config
 */
const nroOverride = process.argv[2] || null;
const config = getConfig(nroOverride);
console.log(process.cwd(), '\n', config);
if (!config.nro) {
  console.log('Please specify NRO name by using .p4-env.json file');
  process.exit(1);
}

/**
 * Clone NRO deployment repo
 */
console.log('Cloning deployment repo ...');
cloneIfNotExists(config.nro.dir, `git@github.com:greenpeace/${config.nro.repo}.git`);
const composerConfig = getNroComposerRequirements(config);
const keys = Object.keys(composerConfig.require || {}).filter(k => k.startsWith('greenpeace/planet4-child-theme-'))
const theme = keys[0] || null;

/**
 * Clone NRO theme
 */
let themeName = null;
if (theme) {
  themeName = theme.replace('greenpeace/', '');
  const themePath = `${config.themesDir}/${themeName}`;
  cloneIfNotExists(themePath, `git@github.com:${theme}.git`);
}
