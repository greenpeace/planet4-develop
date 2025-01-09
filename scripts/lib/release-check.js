const https = require('https');
const {execSync} = require('child_process');

const user = 'greenpeace';
const repo = 'planet4-develop';

function getLocalCommitHash() {
  return execSync('git rev-parse HEAD', {encoding: 'utf8'}).trim();
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

function fetchTagCommitHash(tag_name) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${user}/${repo}/git/refs/tags/${tag_name}`,
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

function checkForNewRelease() {
  const releaseInfo = fetchLatestReleaseInfo().catch(err => {
    console.error('Error fetching release information:', err.message);
  });

  releaseInfo.then(info => {
    const latestVersion = info.tag_name;

    const tagInfo = fetchTagCommitHash(latestVersion).catch(err => {
      console.error('Error fetching tag information:', err.message);
    });

    tagInfo.then(data => {
      const tag_hash = data.object.sha;

      const localCommitHash = getLocalCommitHash();

      if (localCommitHash !== tag_hash) {
        console.log(
          `\nNew Planet 4 developer environment release available: ${latestVersion}`
        );
        console.log('You should update!');
      }

    });
  });
}

module.exports = {checkForNewRelease};
