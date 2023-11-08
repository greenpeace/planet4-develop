const {getConfig} = require('./lib/config');
const {run} = require('./lib/run');
const {isDir, isRepo} = require('./lib/utils');

const config = getConfig();
const themeDir = `${config.themesDir}/planet4-master-theme`;
const pluginDir = `${config.pluginsDir}/planet4-plugin-gutenberg-blocks`;

if (isDir(themeDir) && !isRepo(themeDir)) {
  run(`sudo rm -rf ${themeDir}`);
}
if (isDir(pluginDir) && !isRepo(pluginDir)) {
  run(`sudo rm -rf ${pluginDir}`);
}
