const { run } = require('./lib/run')

const shell = process.argv[2] || 'php'

if (shell === 'php') {
  run('docker compose -f $(wp-env install-path)/docker-compose.yml exec wordpress bash')
}

if (shell === 'mysql') {
  const db = String.fromCharCode(
    ...run('wp-env run cli config get DB_NAME', { stdio: 'pipe' })
  ).trim()

  run(`docker compose -f $(wp-env install-path)/docker-compose.yml exec mysql mysql -uroot -ppassword -D ${db}`)
}
