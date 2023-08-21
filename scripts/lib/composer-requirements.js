const { readFileSync, writeFileSync, copyFileSync } = require('fs')
const { composer } = require('./run')
const { isDir } = require('./utils')

function generateBaseComposerRequirements (config) {
  const planet4Base = `${config.paths.local.app}/planet4-base`

  copyFileSync(
    `${planet4Base}/composer.json`,
    `${config.paths.local.app}/composer.json`
  )

  composer('config --unset repositories.0', config.paths.container.app)
  composer('config --unset extra.merge-plugin', config.paths.container.app)
  composer('config --json extra.installer-paths "{\\"plugins/{\\$name}/\\": [\\"type:wordpress-plugin\\"],\\"themes/{\\$name}/\\": [\\"type:wordpress-theme\\"]}"', config.paths.container.app)

  if (isDir(`${config.paths.local.themes}/planet4-master-theme`)) {
    composer('remove --no-update greenpeace/planet4-master-theme', config.paths.container.app)
  }

  if (isDir(`${config.paths.local.plugins}/planet4-plugin-gutenberg-blocks`)) {
    composer('remove --no-update greenpeace/planet4-plugin-gutenberg-blocks', config.paths.container.app)
  }

  composer('remove --no-update greenpeace/planet4-nginx-helper', config.paths.container.app)

  const baseComposerConfig = JSON.parse(readFileSync(`${config.paths.local.app}/composer.json`))
  console.log('baseComposerConfig', baseComposerConfig)
  if (baseComposerConfig?.repositories) {
    for (const k in baseComposerConfig.repositories) {
      if (baseComposerConfig.repositories[k]?.type === 'package'
        && baseComposerConfig.repositories[k]?.package.name.startsWith('plugins/')
      ) {
        baseComposerConfig.repositories[k].package.type = 'wordpress-plugin'
      }
    }
  }

  writeFileSync(`${config.paths.local.app}/composer.json`, JSON.stringify(baseComposerConfig, null, '  '))
  return baseComposerConfig
}

function generateNROComposerRequirements (config) {
  const baseComposerConfig = JSON.parse(readFileSync(`${config.paths.local.app}/composer.json`))
  const nroComposerConfig = getNroComposerRequirements(config)

  const merged = {
    require: { ...baseComposerConfig.require, ...nroComposerConfig.require },
    config: { ...baseComposerConfig.config, ...nroComposerConfig.config },
    scripts: { ...baseComposerConfig.scripts, ...nroComposerConfig.scripts }
  }
  const composerConfig = { ...baseComposerConfig, ...merged }
  // @todo: resolve composer scripts and/or `wp` usage from composer container
  writeFileSync(`${config.paths.local.app}/composer.json`, JSON.stringify(composerConfig, null, '  '))
  return composerConfig
}

function getNroComposerRequirements (config) {
  return JSON.parse(readFileSync(`${config.paths.local.app}/${config.nro.dir}/composer-local.json`)) || {}
}

module.exports = {
  generateBaseComposerRequirements,
  generateNROComposerRequirements,
  getNroComposerRequirements
}
