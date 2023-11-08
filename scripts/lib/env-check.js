const {readFileSync} = require('fs');
const {runWithOutput} = require('./run');

function nodeCheck() {
  const nodeVersionRequired = parseInt(readFileSync('.nvmrc'));
  const nodeVersionRunning = parseInt(
    process.version.split('.')[0].substr(1)
  ); // <string> "vX.Y.Z" => <int> X
  if (nodeVersionRunning !== nodeVersionRequired) {
    console.error(
      `This installation process requires Node version ${nodeVersionRequired}. You can run <nvm use> to switch version.`
    );
    process.exit(1);
  }
}

function wpenvCheck () {
  const versionRequired = '8';
  const versionRunning = runWithOutput('npx wp-env --version').split('.')[0];
  if (versionRequired !== versionRunning) {
    console.error(
      `\u001b[31m\u2717\u001b[0m This installation process requires wp-env version ${versionRequired}. Version <${versionRunning}> is not officially supported.`
    );
  }
}

module.exports = {nodeCheck, wpenvCheck};
