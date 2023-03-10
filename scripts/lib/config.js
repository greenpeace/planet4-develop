const { readFileSync, existsSync } = require('fs')

function getConfig (override) {
  const wpEnvConfig = JSON.parse(readFileSync('./.wp-env.json'))
  const p4EnvConfig = existsSync('./.p4-env.json')
    ? JSON.parse(readFileSync('./.p4-env.json')) || {}
    : {}
  const appDir = 'planet4'

  const config = {
    appDir,
    baseDir: `${appDir}/planet4-base`,
    themesDir: wpEnvConfig.mappings['wp-content/themes'],
    pluginsDir: wpEnvConfig.mappings['wp-content/plugins'],
    uploadsDir: wpEnvConfig.mappings['wp-content/uploads'],
    verbose: process.env.VERBOSE || false,
    ...wpEnvConfig,
    ...override,
    nro: getNroConfig(override.nro || p4EnvConfig.nro || null, appDir)
  }

  return config
}

function getNroConfig (nroConfig, appDir) {
  return nroConfig && nroConfig.name
    ? {
        repo: `planet4-${nroConfig.name}`,
        dir: `${appDir}/planet4-${nroConfig.name}`,
        db: `planet4_${nroConfig.name.replace('-', '_')}`,
        dbBucket: `planet4-${nroConfig.name}-master-db-backup`,
        imgBucket: `planet4-${nroConfig.name}-stateless`,
        ...nroConfig
      }
    : null
}

module.exports = {
  getConfig
}
