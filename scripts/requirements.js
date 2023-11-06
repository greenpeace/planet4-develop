const {runWithOutput} = require('./lib/run');
const {nodeCheck, wpenvCheck} = require('./lib/env-check');
const {checkForNewRelease} = require('./lib/release-check');

const greenCheck = '\u001b[32m\u2713\u001b[0m';
const orangeCross = '\u001b[33m\u2717\u001b[0m';
const redCross = '\u001b[31m\u2717\u001b[0m';

function check(cmd, title, fail) {
  console.log(`\n${title}`);
  try {
    const output = runWithOutput(cmd);
    console.log(`${greenCheck} Found: ${output}`);
  } catch (error) {
    console.log(`${fail}`);
    if (process.env.VERBOSE) {
      console.log(error);
    }
  }
}

checkForNewRelease();

console.log('Shell: ');
console.log(process.env.SHELL);

console.log('Node version: ' + process.version);
nodeCheck();

check(
  'docker --version',
  'Docker version:',
  `${redCross} Not found. Please install Docker.`
);
check(
  'docker compose version',
  'Docker compose version:',
  `${redCross} Not found. Please install or activate Docker compose v2.`
);

check('npx wp-env --version', 'wp-env version:', `${redCross} Not found. Please install wp-env.`);
wpenvCheck();

const nvmPath = process.env.NVM_DIR ? `${process.env.NVM_DIR}/nvm.sh` : '~/.nvm/nvm.sh';
check(`. ${nvmPath} && nvm --version`, 'nvm version:', `${redCross} Not found (nvm path used: ${nvmPath}). Please install NVM.`);
check('curl --version', 'curl version:', `${redCross} Not found. Please install Curl.`);
check('gcloud version', 'gcloud version:', `${orangeCross} Not found. Install gcloud only if you want to import NRO database.`);
