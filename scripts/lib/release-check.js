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

function fetchHelper(options) {
  return new Promise((resolve, reject) => {
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

function fetchGithub(subpath) {
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${user}/${repo}${subpath}`,
    method: 'GET',
    headers: {'User-Agent': 'Planet 4 dev env'},
  };
  return fetchHelper(options);
}

function fetchLatestReleaseInfo() {
  return fetchGithub('/releases/latest');
}

function fetchLatestUpstreamMainCommit() {
  return fetchGithub('/branches/main');
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

async function checkForNewRelease({
  greenCheck, orangeCross, redCross,
}) {
  console.log('Inspecting your checked-out code:');

  const releaseInfo = await fetchLatestReleaseInfo().catch(err => {
    console.error(`${redCross} Error fetching release information: ${err.message}`);
  });
  const upstreamCommitInfo = await fetchLatestUpstreamMainCommit().catch(err => {
    console.error(`${redCross} Error fetching remote commit information: ${err.message}`);
  });

  const info = releaseInfo;
  const latestVersion = info.tag_name;
  const localVersion = getLocalVersion();

  if (compareVersions(localVersion, latestVersion) === -1) {
    console.log(
      `\nNew Planet 4 developer environment release available: ${latestVersion}`
    );
    console.log(`${orangeCross} You should update !`);
  }

  const latestCommitHash = upstreamCommitInfo.commit.sha;
  const localCommitHash = getLocalCommitHash();

  if (
    getLocalBranch() === 'main' &&
    localCommitHash !== latestCommitHash
  ) {
    console.log(
      `\n${orangeCross} Your local commit (${localCommitHash}) does not match the latest "main" commit (${latestCommitHash})`
    );
    const infoColor = '\u001b[34m'; // blue color code
    const resetColor = '\u001b[0m'; // reset color code
    const startBold = '\x1b[1m';
    const endBold = '\x1b[0m';
    const infoIcon = '\u2139';
    const helpText = 'You may want to update your local commit by running "git pull"';
    console.log(`➞ ${infoColor}${startBold} ${infoIcon} ${helpText} ${endBold}${resetColor}`);
  } else {
    console.log(`${greenCheck} Your checked out code is up to date!`);
  }
}

module.exports = {checkForNewRelease};
