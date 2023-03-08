const { readFileSync } = require('fs');

function getConfig() {
  const wpEnvConfig = JSON.parse(readFileSync('./.wp-env.json'));
  const p4EnvConfig = JSON.parse(readFileSync('./.p4-env.json')) || {};
  const appDir = 'planet4';

  const nroConfig = p4EnvConfig.nro ? {
    name: p4EnvConfig.nro,
    db: `planet4_${p4EnvConfig.nro.replace('-', '_')}`,
    repo: `planet4-${p4EnvConfig.nro}`
  } : null

  const config = {
      appDir: appDir,
      baseDir: `${appDir}/planet4-base`,
      themesDir: wpEnvConfig.mappings['wp-content/themes'],
      pluginsDir: wpEnvConfig.mappings['wp-content/plugins'],
      verbose: process.env.VERBOSE || false,
      ...wpEnvConfig,
      ...p4EnvConfig,
      nro: nroConfig
  };

  return config;
}

module.exports = {
  getConfig
};
