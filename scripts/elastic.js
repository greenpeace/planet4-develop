const { run } = require('./lib/run')

const action = process.argv[2] || 'activate'
const dcConfig = '-f $(wp-env install-path)/docker-compose.yml -f scripts/docker-compose.p4.yml'

if (action === 'activate') {
  run(`docker compose ${dcConfig} up -d elasticsearch`)
  run('wp-env run cli option update ep_host "http://elasticsearch:9200/"')
  run('wp-env run cli plugin activate elasticpress')
  run('wp-env run cli elasticpress index --setup --quiet --url=localhost')

  // clear redis cache ?
  run('wp-env run cli timber clear_cache &>/dev/null')
  run('wp-env run cli cache flush')
}

if (action === 'deactivate') {
  run(`docker compose ${dcConfig} stop elasticsearch`)
  run('wp-env run cli option delete ep_host')
  // run('wp-env run cli plugin deactivate elasticpress')
}
