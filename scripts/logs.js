const {run} = require('./lib/run');

/**
 * Config
 */
const container = process.argv[2] || 'php';

if (container === 'php') {
  run('docker compose -f $(npx wp-env install-path)/docker-compose.yml logs -f wordpress');
}

if (container === 'mysql') {
  run('docker compose -f $(npx wp-env install-path)/docker-compose.yml logs -f mysql');
}


