const { run, wp } = require('./lib/run')

const shell = process.argv[2] || 'php'

if (shell === 'php') {
  run('docker compose -f $(wp-env install-path)/docker-compose.yml exec wordpress bash')
}

if (shell === 'mysql') {
  const db = String.fromCharCode(
    ...wp('config get DB_NAME', { stdio: 'pipe' })
  ).trim()

  run(`docker compose -f $(wp-env install-path)/docker-compose.yml exec mysql mariadb -uroot -ppassword -D ${db}`)
}
