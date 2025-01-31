const {getConfig} = require('./lib/config');
const {run} = require('./lib/run');
const {isDir, isRepo} = require('./lib/utils');

const config = getConfig();
const themeDir = `${config.themesDir}/planet4-master-theme`;

if (isDir(themeDir) && !isRepo(themeDir)) {
  run(`sudo rm -rf ${themeDir}`);
}
