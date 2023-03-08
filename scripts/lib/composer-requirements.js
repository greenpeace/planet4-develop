const { readFileSync, writeFileSync, existsSync, lstatSync, copyFileSync } = require('fs');
const { run } = require('./run');

function generateBaseComposerRequirements(config) {
  copyFileSync(`${config.baseDir}/composer.json`, `${config.appDir}/composer.json`);

  run(`wp-env run composer -d /app/${config.appDir}/ config --unset repositories.0`);
  run(`wp-env run composer -d /app/${config.appDir}/ config --unset extra.merge-plugin`);
  run(`wp-env run composer -d /app/${config.appDir}/ config --json extra.installer-paths '"{\\"plugins/{\\$name}/\\": [\\"type:wordpress-plugin\\"],\\"themes/{\\$name}/\\": [\\"type:wordpress-theme\\"]}"'`);
  run(`wp-env run composer -d /app/${config.appDir}/ config platform.php "${config.phpVersion}"`);

  if (existsSync(`${config.themesDir}/planet4-master-theme`)
      && lstatSync(`${config.themesDir}/planet4-master-theme`).isDirectory()
  ) {
      run(`wp-env run composer -d /app/${config.appDir}/ remove --no-update greenpeace/planet4-master-theme`);
  }

  if (existsSync(`${config.pluginsDir}/planet4-plugin-gutenberg-blocks`)
      && lstatSync(`${config.pluginsDir}/planet4-plugin-gutenberg-blocks`).isDirectory()
  ) {
      run(`wp-env run composer -d /app/${config.appDir}/ remove --no-update greenpeace/planet4-plugin-gutenberg-blocks`);
  }
}

function generateNROComposerRequirements(config) {
  const nroComposerFile = `composer-${config.nro.name}.json`;
  copyFileSync(`${nroDir}/composer-local.json`, `${config.appDir}/${nroComposerFile}`);

  const composerConfig = JSON.parse(readFileSync(`${config.appDir}/composer.json`));
  const nroComposerConfig = JSON.parse(readFileSync(`${config.appDir}/${nroComposerFile}`)) || {};

  const merged = {
    "require": { ...composerConfig.require, ...nroComposerConfig.require },
    "config": { ...composerConfig.config, ...nroComposerConfig.config },
    "scripts": { ...composerConfig.scripts, ...nroComposerConfig.scripts },
  };
  const newComposerConfig = { ...composerConfig, ...merged };
  // @todo: resolve composer scripts and/or `wp` usage from composer container
  writeFileSync(`${config.appDir}/composer.json`, JSON.stringify(newComposerConfig));

  return newComposerConfig;
}

module.exports = {
  generateBaseComposerRequirements,
  generateNROComposerRequirements
}
