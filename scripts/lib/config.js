const {readFileSync, existsSync} = require('fs');

function getConfig(override) {
  const wpEnvConfig = JSON.parse(readFileSync('./.wp-env.json'));
  const wpEnvConfigOverride = existsSync('./.wp-env.override.json') ?
    JSON.parse(readFileSync('./.wp-env.override.json')) :
    {};
  const p4EnvConfig = JSON.parse(readFileSync('./.p4-env.json'));
  const p4EnvConfigOverride = existsSync('./.p4-env.override.json') ?
    JSON.parse(readFileSync('./.p4-env.override.json')) || {} :
    {};

  const appDir = 'planet4';

  const merged = deepMerge(
    wpEnvConfig,
    wpEnvConfigOverride,
    p4EnvConfig,
    p4EnvConfigOverride
  );

  const config = {
    paths: {
      local: {
        app: `./${appDir}`,
        common: `./${appDir}/common`,
        themes: `./${appDir}/themes`,
        plugins: `./${appDir}/plugins`,
        uploads: `./${appDir}/uploads`,
        languages: `./${appDir}/languages`,
      },
      container: {
        app: '/var/www/html/wp-content',
        common: 'wp-content/common',
        themes: 'wp-content/themes',
        plugins: 'wp-content/plugins',
        uploads: 'wp-content/uploads',
        languages: 'wp-content/languages',
      },
    },
    verbose: process.env.VERBOSE || false,
    ...merged,
    ...override,
    nro: getNroConfig(override?.nro || p4EnvConfig?.nro || null),
  };

  return config;
}

function getNroConfig(nroConfig) {
  return nroConfig && nroConfig.name ?
    {
      repo: `planet4-${nroConfig.name}`,
      dir: `planet4-${nroConfig.name}`,
      db: `planet4_${nroConfig.name.replace('-', '_')}`,
      dbBucket: `planet4-${nroConfig.name}-master-db-backup`,
      imgBucket: `planet4-${nroConfig.name}-stateless`,
      ...nroConfig,
		  } :
    null;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge(target, ...sources) {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, {[key]: {}});
        }
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, {[key]: source[key]});
      }
    }
  }

  return deepMerge(target, ...sources);
}

module.exports = {
  getConfig,
};
