const {run, wp} = require('./lib/run');
const {parseArgs} = require('./lib/utils');

/**
 * Main
 */
const args = parseArgs(process.argv, {command: 'activate'});
const dcConfig = '-f $(npx wp-env install-path)/docker-compose.yml -f scripts/docker-compose.p4.yml';

if (args.command === 'activate') {
  run(`docker compose ${dcConfig} up --force-recreate -d elasticsearch`);
  wp('option update ep_host "http://elasticsearch:9200/"');
  wp('plugin activate elasticpress');
  setTimeout(
    () => {
      wp('elasticpress index --setup --yes --url=localhost');
      wp('cache flush');
    },
    3000
  );
}

if (args.command === 'deactivate') {
  run(`docker compose ${dcConfig} stop elasticsearch`);
  wp('plugin deactivate elasticpress');
}

if (args.command === 'stop') {
  run(`docker compose ${dcConfig} stop elasticsearch`);
  wp('option delete ep_host');
}
