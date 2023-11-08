const {run} = require('./run');

function getCurrentNetwork () {
  const network = JSON.parse(String.fromCharCode(
    ...run('docker network ls --format=json --filter name=$(basename $(npx wp-env install-path))', {stdio: 'pipe'})
  ).trim());

  console.log(network);

  return network.Name || null;
}

module.exports = {getCurrentNetwork};
