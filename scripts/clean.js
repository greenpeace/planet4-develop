const {run} = require('./lib/run');
const {getConfig} = require('./lib/config');
const {isDir} = require('./lib/utils');

const config = getConfig();

run('npx wp-env stop');
run('npx wp-env clean');
if (config.paths.local.app.length > 0 && !config.paths.local.app.includes('..') && isDir(config.paths.local.app)) {
  console.log(`Deleting all files in <${config.paths.local.app}> ...`);
  run(`rm -rf ./${config.paths.local.app}`);
}
