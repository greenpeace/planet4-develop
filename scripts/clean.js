const { run } = require('./lib/run');
const { getConfig } = require('./lib/config');
const { isDir } = require('./lib/utils');

const config = getConfig();

run('wp-env stop');
run('wp-env clean');
if (config.appDir.length > 0 && !config.appDir.includes('..') && isDir(config.appDir)) {
  console.log(`Deleting all files in <${config.appDir}> ...`)
  run(`sudo rm -rf ${config.appDir}`);
}
