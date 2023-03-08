// Requires running instance ?
// Pull main repos from release
// Pull deploy repo
// Fetch DB
// Switch DB
// Add reverse proxy

const { renameSync, readFileSync, writeFileSync, existsSync, lstatSync, mkdirSync, copyFileSync } = require('fs');

const { getConfig } = require('./lib/config');
const { nodeCheck } = require('./lib/node-check');
const { run } = require('./lib/run');

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

const nro = 'finland';
const nroConfig = {
  name: nro,
  db: `planet4_${nro.replace('-', '_')}`,
  repo: `planet4-${nro}`
};

/**
 * Install main repos
 */
const nroDir = `${config.appDir}/${nroConfig.repo}`;
console.log('Cloning deployment repo ...');
console.log(`>>> ${nroDir}`);
existsSync(`${nroDir}`) && lstatSync(`${nroDir}`).isDirectory()
  ? run('git status', {cwd: `${nroDir}`})
  : run(`git clone git@github.com:greenpeace/${nroConfig.repo}.git ${nroDir}`);

/**
 * Start WP
 */
// run('wp-env start --update');

/**
 * Merge composer requirements
 */
console.log('Merging base composer requirements ...');
copyFileSync(`${config.baseDir}/composer.json`, `${config.appDir}/composer.json`);
run(`wp-env run composer -d /app/${config.appDir}/ config --unset repositories.0`);
run(`wp-env run composer -d /app/${config.appDir}/ config --unset extra.merge-plugin`);
run(`wp-env run composer -d /app/${config.appDir}/ config --json extra.installer-paths '"{\\"plugins/{\\$name}/\\": [\\"type:wordpress-plugin\\"],\\"themes/{\\$name}/\\": [\\"type:wordpress-theme\\"]}"'`);
run(`wp-env run composer -d /app/${config.appDir}/ config platform.php "${config.phpVersion}"`);
if (existsSync(`${config.themesDir}/planet4-master-theme`)
    && lstatSync(`${config.themesDir}/planet4-master-theme`).isDirectory()
) {
    run('wp-env run composer -d /app/planet4/ remove --no-update greenpeace/planet4-master-theme');
}
if (existsSync(`${config.pluginsDir}/planet4-plugin-gutenberg-blocks`)
    && lstatSync(`${config.pluginsDir}/planet4-plugin-gutenberg-blocks`).isDirectory()
) {
    run('wp-env run composer -d /app/planet4/ remove --no-update greenpeace/planet4-plugin-gutenberg-blocks');
}

/**
 * Merge NRO composer requirements with base
 */
console.log('Merging NRO composer requirements ...');
const nroComposerFile = `composer-${nroConfig.name}.json`;
copyFileSync(`${nroDir}/composer-local.json`, `${config.appDir}/${nroComposerFile}`);
run(`wp-env run composer -d /app/${config.appDir}/ config --json extra.merge-plugin '"{\\"include\\": [\\"${nroComposerFile}\\"]}"'`);
const composerConfig = JSON.parse(readFileSync(`${config.appDir}/composer.json`));
const nroComposerConfig = JSON.parse(readFileSync(`${config.appDir}/${nroComposerFile}`)) || {};
const keys = Object.keys(nroComposerConfig.require || {}).filter(k => k.startsWith('greenpeace/planet4-child-theme'))
console.log(keys);
const nroTheme = keys[0] || null;

const merged = {
  "require": { ...composerConfig.require, ...nroComposerConfig.require },
  "config": { ...composerConfig.config, ...nroComposerConfig.config },
  "scripts": { ...composerConfig.scripts, ...nroComposerConfig.scripts },
};
const newComposerConfig = { ...composerConfig, ...merged };
writeFileSync(`${config.appDir}/composer.json`, JSON.stringify(newComposerConfig));

/**
 * Install NRO theme and plugins
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
