const { getConfig } = require('./lib/config');
const { getMainReposFromGit, installRepos } = require('./lib/main-repos');

const config = getConfig();

getMainReposFromGit(config);
installRepos(config);
