const { run, composer } = require('./run')
const { isDir, isRepo, cloneIfNotExists } = require('./utils')

function getBaseRepoFromGit (config) {
  cloneIfNotExists(
    `${config.paths.local.app}/planet4-base`,
    'https://github.com/greenpeace/planet4-base.git'
  )

  run(
    `git checkout ${config.planet4.repos['planet4-base'] || 'main'} || true`,
    { cwd: `${config.paths.local.app}/planet4-base` }
  )
}

function getMainReposFromGit (config) {
  const themePath = `${config.paths.local.themes}/planet4-master-theme`
  isRepo(themePath)
    ? run('git status', { cwd: themePath })
    : run(`rm -rf ${themePath} && git clone https://github.com/greenpeace/planet4-master-theme.git ${themePath}`)

  run(
    `git checkout ${config.planet4.repos['planet4-master-theme'] || 'main'} || true`,
    { cwd: themePath }
  )

  const pluginPath = `${config.paths.local.plugins}/planet4-plugin-gutenberg-blocks`
  isRepo(pluginPath)
    ? run('git status', { cwd: pluginPath })
    : run(`rm -rf ${pluginPath} && git clone --recurse-submodules --shallow-submodule https://github.com/greenpeace/planet4-plugin-gutenberg-blocks.git ${pluginPath}`)

  run(
    `git checkout ${config.planet4.repos['planet4-plugin-gutenberg-blocks'] || 'main'} || true`,
    { cwd: pluginPath }
  )
};

function getMainReposFromRelease (config, force = false) {
  if (!force
    && isDir(`${config.paths.local.themes}/planet4-master-theme`)
    && isDir(`${config.paths.local.plugins}/planet4-plugin-gutenberg-blocks`)
  ) {
    return
  }

  const themeRelease = 'https://github.com/greenpeace/planet4-master-theme/releases/latest/download/planet4-master-theme.zip'
  const pluginRelease = 'https://github.com/greenpeace/planet4-plugin-gutenberg-blocks/releases/latest/download/planet4-plugin-gutenberg-blocks.zip'

  run(`curl -L ${themeRelease} > content/planet4-master-theme.zip`)
  run(`curl -L ${pluginRelease} > content/planet4-plugin-gutenberg-blocks.zip`)

  run(`mkdir -p ${config.paths.local.themes} && mkdir -p ${config.paths.local.plugins}`)
  run(`unzip -o content/planet4-master-theme.zip -d ${config.paths.local.themes}/planet4-master-theme`)
  run(`unzip -o content/planet4-plugin-gutenberg-blocks.zip -d ${config.paths.local.plugins}/planet4-plugin-gutenberg-blocks`)
}

function installRepos (config) {
  // composer(`config platform.php "${config.phpVersion}"`, `/app/${config.themesDir}/planet4-master-theme `)
  composer('install', `${config.paths.container.themes}/planet4-master-theme `)
  // composer(`config platform.php "${config.phpVersion}"`, `/app/${config.pluginsDir}/planet4-plugin-gutenberg-blocks`)
  composer('install', `${config.paths.container.plugins}/planet4-plugin-gutenberg-blocks`)
}

function installNpmDependencies (config) {
  process.env.PUPPETEER_SKIP_DOWNLOAD = true
  process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true
  run('npm install', { cwd: `${config.paths.local.themes}/planet4-master-theme` })
  run('npm install', { cwd: `${config.paths.local.plugins}/planet4-plugin-gutenberg-blocks` })
}

function buildAssets (config, force = false) {
  if (!force
    && isDir(`${config.paths.local.themes}/planet4-master-theme/assets/build`)
    && isDir(`${config.paths.local.plugins}/planet4-plugin-gutenberg-blocks/assets/build`)
  ) {
    return
  }

  installNpmDependencies(config)
  run('npm run build', { cwd: `${config.paths.local.themes}/planet4-master-theme` })
  run('npm run build', { cwd: `${config.paths.local.plugins}/planet4-plugin-gutenberg-blocks` })
}

function setComposerConfig (config) {
  if (config?.planet4?.composer?.processTimeout) {
    composer(`config --global process-timeout ${config.planet4.composer.processTimeout}`, config.paths.container.app)
  }
}

module.exports = {
  getBaseRepoFromGit,
  getMainReposFromGit,
  getMainReposFromRelease,
  buildAssets,
  installRepos,
  setComposerConfig
}
