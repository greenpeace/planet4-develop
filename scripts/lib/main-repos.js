const {run, composer} = require('./run');
const {isDir, isRepo, cloneIfNotExists} = require('./utils');

function getBaseRepoFromGit(config) {
  cloneIfNotExists(
    `${config.paths.local.app}/planet4-base`,
    'https://github.com/greenpeace/planet4-base.git'
  );

  run(
    `git checkout ${
      config.planet4.repos['planet4-base'] || 'main'
    } || true`,
    {cwd: `${config.paths.local.app}/planet4-base`}
  );
}

function getMainReposFromGit(config) {
  const themePath = `${config.paths.local.themes}/planet4-master-theme`;
  if(isRepo(themePath)) {
    run('git status', {cwd: themePath});
  } else {
    run(`rm -rf ${themePath} && git clone https://github.com/greenpeace/planet4-master-theme.git ${themePath}`);
  }

  run(
    `git checkout ${
      config.planet4.repos['planet4-master-theme'] || 'main'
    } || true`,
    {cwd: themePath}
  );
}

function getMainReposFromRelease(config, force = false) {
  if (
    !force &&
		isDir(`${config.paths.local.themes}/planet4-master-theme`)
  ) {
    return;
  }

  const themeRelease =
		'https://github.com/greenpeace/planet4-master-theme/releases/latest/download/planet4-master-theme.zip';

  run(`curl -L ${themeRelease} > content/planet4-master-theme.zip`);

  run(
    `mkdir -p ${config.paths.local.themes} && mkdir -p ${config.paths.local.plugins}`
  );
  run(
    `unzip -o content/planet4-master-theme.zip -d ${config.paths.local.themes}/planet4-master-theme`
  );
}

function installRepos(config) {
  composer(
    'install',
    `${config.paths.container.themes}/planet4-master-theme `
  );
}

function installNpmDependencies (config) {
  process.env.PUPPETEER_SKIP_DOWNLOAD = true;
  process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true;
  run('npm install --legacy-peer-deps', {cwd: `${config.paths.local.themes}/planet4-master-theme`});
}

function buildAssets(config, force = false) {
  if (
    !force &&
		isDir(
		  `${config.paths.local.themes}/planet4-master-theme/assets/build`
		)
  ) {
    return;
  }

  installNpmDependencies(config);
  run('npm run build', {
    cwd: `${config.paths.local.themes}/planet4-master-theme`,
  });
}

function setComposerConfig (config) {
  if (config?.planet4?.composer?.processTimeout) {
    composer(`config --global process-timeout ${config.planet4.composer.processTimeout}`, config.paths.container.app);
  }
}

module.exports = {
  getBaseRepoFromGit,
  getMainReposFromGit,
  getMainReposFromRelease,
  buildAssets,
  installRepos,
  setComposerConfig,
};
