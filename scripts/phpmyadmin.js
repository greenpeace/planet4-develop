const fs = require('fs');
const {run} = require('./lib/run');
const {parseArgs} = require('./lib/utils');

const file = '.wp-env.override.json';
const phpmyadminPort = 9001;
const config = JSON.parse(fs.readFileSync(file, 'utf8'));

const args = parseArgs(process.argv, {command: 'activate'});

// Ensure development object exists
config.env = config.env || {};
config.env.development = config.env.development || {};

if (args.command === 'activate') {
  if (!config.env.development.phpmyadminPort) {
    config.env.development.phpmyadminPort = phpmyadminPort;
  }
  console.log(`Activating phpMyAdmin. It will be available at port: ${phpmyadminPort} on next environment start.`);
}

if (args.command === 'deactivate') {
  delete config.env.development.phpmyadminPort;
  run('docker compose -f $(npx wp-env install-path)/docker-compose.yml -f scripts/docker-compose.p4.yml stop phpmyadmin');
}

fs.writeFileSync(file, JSON.stringify(config, null, 2));
