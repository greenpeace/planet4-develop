const { run } = require('./lib/run')
const { parseArgs } = require('./lib/utils')

/**
 * Main
 */
const args = parseArgs(process.argv, { command: 'activate' })
const dcConfig = '-f $(wp-env install-path)/docker-compose.yml -f scripts/docker-compose.p4.yml'

if (args.command === 'activate') {
  run(`docker compose ${dcConfig} up --force-recreate -d elasticsearch`)
  run('wp-env run cli option update ep_host "http://elasticsearch:9200/"')
  run('wp-env run cli plugin activate elasticpress')
  run('wp-env run cli elasticpress index --setup --yes')

  // clear redis cache ?
  run('wp-env run cli timber clear_cache &>/dev/null')
  run('wp-env run cli cache flush')
}

if (args.command === 'deactivate') {
  run(`docker compose ${dcConfig} stop elasticsearch`)
  run('wp-env run cli plugin deactivate elasticpress')
}

if (args.command === 'stop') {
  run(`docker compose ${dcConfig} stop elasticsearch`)
  run('wp-env run cli option delete ep_host')
}
