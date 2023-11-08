const https = require('https');
const {execSync} = require('child_process');
const fs = require('fs');

const user = 'greenpeace';
const repo = 'planet4-develop';

function getLocalVersion() {
  const packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJSON.version;
}

function getLocalCommitHash() {
  return execSync('git rev-parse HEAD', {encoding: 'utf8'}).trim();
}

function getLocalBranch() {
  return execSync('git branch --show-current', {encoding: 'utf8'}).trim();
}

function fetchLatestReleaseInfo() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${user}/${repo}/releases/latest`,
      method: 'GET',
      headers: {'User-Agent': 'Planet 4 dev env'},
    };

    https
      .get(options, res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      })
      .on('error', err => {
        reject(err);
      });
  });
}

function compareVersions(versionA, versionB) {
  const normalizeVersion = version =>
    version.startsWith('v') ? version.slice(1) : version;

  const partsA = normalizeVersion(versionA).split('.').map(Number);
  const partsB = normalizeVersion(versionB).split('.').map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const partA = partsA[i] || 0;
    const partB = partsB[i] || 0;

    if (partA > partB) {
      return 1;
    }
    if (partA < partB) {
      return -1;
    }
  }

  return 0;
}

function checkForNewRelease() {
  const releaseInfo = fetchLatestReleaseInfo().catch(err => {
    console.error('Error fetching release information:', err.message);
  });

  releaseInfo.then(info => {
    const latestVersion = info.tag_name;
    const localVersion = getLocalVersion();

    if (compareVersions(localVersion, latestVersion) === -1) {
      console.log(
        `\nNew Planet 4 developer environment release available: ${latestVersion}`
      );
      console.log('You should update !');
    }

    const latestCommitHash = info.target_commitish;
    const localCommitHash = getLocalCommitHash();

    if (
      getLocalBranch() === 'main' &&
			localCommitHash !== latestCommitHash
    ) {
      console.log(
        `\nYour local commit (${localCommitHash}) does not match the latest release commit (${latestCommitHash})`
      );
    }
  });
}

module.exports = {checkForNewRelease};
