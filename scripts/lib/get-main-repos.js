
const { execSync } = require( 'child_process' );
const { renameSync, existsSync, lstatSync } = require('fs');

function getMainReposFromGit({themeDir, pluginDir}) {
    console.log();
    console.log(`>>> ${themeDir}/planet4-master-theme`);
    if (existsSync(`${themeDir}/planet4-master-theme`) && lstatSync(`${themeDir}/planet4-master-theme`).isDirectory()) {
        execSync('git status', {cwd: `${themeDir}/planet4-master-theme`, stdio: 'inherit'});
    } else {
        execSync(`git clone git@github.com:greenpeace/planet4-master-theme.git ${themeDir}/planet4-master-theme`, {stdio: 'inherit'});
    }

    console.log();
    console.log(`>>> ${pluginDir}/planet4-plugin-gutenberg-blocks`);
    if (existsSync(`${pluginDir}/planet4-plugin-gutenberg-blocks`) && lstatSync(`${pluginDir}/planet4-plugin-gutenberg-blocks`).isDirectory()) {
        execSync('git status', {cwd: `${pluginDir}/planet4-plugin-gutenberg-blocks`, stdio: 'inherit'});
    } else {
        execSync(`git clone  --recurse-submodules --shallow-submodule git@github.com:greenpeace/planet4-plugin-gutenberg-blocks.git ${pluginDir}/planet4-plugin-gutenberg-blocks`, {stdio: 'inherit'});
    }
};

function getMainReposFromRelease({themeDir, pluginDir}) {
    console.error('@todo implement');
}

module.exports = {
    getMainReposFromGit,
    getMainReposFromRelease,
};
