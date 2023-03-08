const { readFileSync } = require('fs');

function nodeCheck() {
  const nodeVersionRequired = parseInt(readFileSync('.nvmrc'));
  const nodeVersionRunning = parseInt(process.version.split('.')[0].substr(1)); // <string> "vX.Y.Z" => <int> X
  if (nodeVersionRunning !== nodeVersionRequired) {
    console.error(`This installation process requires Node version ${nodeVersionRequired}. You can run <nvm use> to switch version.`);
    process.exit(1);
  }
}

module.exports = { nodeCheck };
