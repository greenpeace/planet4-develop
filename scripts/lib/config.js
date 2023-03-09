const { readFileSync } = require('fs');

function getConfig(nro) {
  const wpEnvConfig = JSON.parse(readFileSync('./.wp-env.json'));
  const p4EnvConfig = JSON.parse(readFileSync('./.p4-env.json')) || {};
  const appDir = 'planet4';

  const config = {
      appDir: appDir,
      baseDir: `${appDir}/planet4-base`,
      themesDir: wpEnvConfig.mappings['wp-content/themes'],
      pluginsDir: wpEnvConfig.mappings['wp-content/plugins'],
      verbose: process.env.VERBOSE || false,
      ...wpEnvConfig,
      ...p4EnvConfig,
      nro: getNroConfig(nro || p4EnvConfig.nro || null, appDir)
  };

  return config;
}

function getNroConfig(nro, appDir) {
  return nro ? {
    name: nro,
    repo: `planet4-${nro}`,
    dir: `${appDir}/planet4-${nro}`,
    db: `planet4_${nro.replace('-', '_')}`,
    dbBucket: `planet4-${nro}-master-db-backup`,
    imgBucket: `planet4-${nro}-stateless`,
  } : null;
}

module.exports = {
  getConfig
};
