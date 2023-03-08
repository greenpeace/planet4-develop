
const { execSync } = require( 'child_process' );
const { renameSync, existsSync, lstatSync } = require('fs');

function getMainReposFromGit({themesDir, pluginsDir}) {
    console.log();
    console.log(`>>> ${themesDir}/planet4-master-theme`);
    if (existsSync(`${themesDir}/planet4-master-theme`) && lstatSync(`${themesDir}/planet4-master-theme`).isDirectory()) {
        execSync('git status', {cwd: `${themesDir}/planet4-master-theme`, stdio: 'inherit'});
    } else {
        execSync(`git clone git@github.com:greenpeace/planet4-master-theme.git ${themesDir}/planet4-master-theme`, {stdio: 'inherit'});
    }

    console.log();
    console.log(`>>> ${pluginsDir}/planet4-plugin-gutenberg-blocks`);
    if (existsSync(`${pluginsDir}/planet4-plugin-gutenberg-blocks`) && lstatSync(`${pluginsDir}/planet4-plugin-gutenberg-blocks`).isDirectory()) {
        execSync('git status', {cwd: `${pluginsDir}/planet4-plugin-gutenberg-blocks`, stdio: 'inherit'});
    } else {
        execSync(`git clone --recurse-submodules --shallow-submodule git@github.com:greenpeace/planet4-plugin-gutenberg-blocks.git ${pluginsDir}/planet4-plugin-gutenberg-blocks`, {stdio: 'inherit'});
    }
};

function getMainReposFromRelease({themesDir, pluginsDir}) {
    console.error('@todo implement');
}

module.exports = {
    getMainReposFromGit,
    getMainReposFromRelease,
};
