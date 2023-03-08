
const { renameSync, existsSync, lstatSync } = require('fs');
const { run } = require('./run');

function getMainReposFromGit({themesDir, pluginsDir}) {
  run (`mkdir -p ${themesDir} && mkdir -p ${pluginsDir}`);

  existsSync(`${themesDir}/planet4-master-theme`) && lstatSync(`${themesDir}/planet4-master-theme`).isDirectory()
    ? run('git status', {cwd: `${themesDir}/planet4-master-theme`})
    : run(`git clone git@github.com:greenpeace/planet4-master-theme.git ${themesDir}/planet4-master-theme`);

  existsSync(`${pluginsDir}/planet4-plugin-gutenberg-blocks`) && lstatSync(`${pluginsDir}/planet4-plugin-gutenberg-blocks`).isDirectory()
    ? run('git status', {cwd: `${pluginsDir}/planet4-plugin-gutenberg-blocks`})
    : run(`git clone --recurse-submodules --shallow-submodule git@github.com:greenpeace/planet4-plugin-gutenberg-blocks.git ${pluginsDir}/planet4-plugin-gutenberg-blocks`);
};

function getMainReposFromRelease(config, force=false) {
  if (!force
    && existsSync(`${config.themesDir}/planet4-master-theme`)
    && existsSync(`${config.pluginsDir}/planet4-plugin-gutenberg-blocks`)
  ) {
    return;
  }

  const themeRelease = 'https://github.com/greenpeace/planet4-master-theme/releases/latest/download/planet4-master-theme.zip';
  const pluginRelease = 'https://github.com/greenpeace/planet4-plugin-gutenberg-blocks/releases/latest/download/planet4-plugin-gutenberg-blocks.zip';

  run(`curl -L ${themeRelease} > content/planet4-master-theme.zip`);
  run(`curl -L ${pluginRelease} > content/planet4-plugin-gutenberg-blocks.zip`);

  run (`mkdir -p ${config.themesDir} && mkdir -p ${config.pluginsDir}`);
  run(`unzip -o content/planet4-master-theme.zip -d ${config.themesDir}/planet4-master-theme`);
  run(`unzip -o content/planet4-plugin-gutenberg-blocks.zip -d ${config.pluginsDir}/planet4-plugin-gutenberg-blocks`);
}

function installRepos(config) {
  run(`wp-env run composer -d /app/${config.themesDir}/planet4-master-theme config platform.php "${config.phpVersion}"`);
  run(`wp-env run composer -d /app/${config.themesDir}/planet4-master-theme install --ignore-platform-reqs`);
  run(`wp-env run composer -d /app/${config.pluginsDir}/planet4-plugin-gutenberg-blocks config platform.php "${config.phpVersion}"`);
  run(`wp-env run composer -d /app/${config.pluginsDir}/planet4-plugin-gutenberg-blocks install --ignore-platform-reqs`);
}

function buildAssets(config, force=false) {
  if (!force
    && existsSync(`${config.themesDir}/planet4-master-theme/assets/build`)
    && existsSync(`${config.pluginsDir}/planet4-plugin-gutenberg-blocks/assets/build`)
  ) {
    return;
  }

  process.env.PUPPETEER_SKIP_DOWNLOAD = true;
  process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true;
  run('npm install && npm run build', {cwd: `${config.themesDir}/planet4-master-theme`});
  run('npm install && npm run build', {cwd: `${config.pluginsDir}/planet4-plugin-gutenberg-blocks`});
}

module.exports = {
  getMainReposFromGit,
  getMainReposFromRelease,
  buildAssets,
  installRepos
};
