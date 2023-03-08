const { readFileSync } = require('fs');

function getConfig() {
  const wpEnvConfig = JSON.parse(readFileSync('./.wp-env.json'));
  const appDir = 'planet4';

  const config = {
      appDir: appDir,
      baseDir: `${appDir}/planet4-base`,
      themesDir: wpEnvConfig.mappings['wp-content/themes'],
      pluginsDir: wpEnvConfig.mappings['wp-content/plugins'],
      ...wpEnvConfig
  };

  return config;
}

module.exports = {
  getConfig
};
