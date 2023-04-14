const { run } = require('./run')

function mysqlRootExec (cmd, opts) {
  const dcCommand = mysqlRootCommand(cmd)
  return run(dcCommand, opts)
};

function mysqlRootExecNoTTY (cmd, opts) {
  const dcCommand = mysqlRootCommandNoTTY(cmd)
  return run(dcCommand, opts)
};

function mysqlRootCommand (cmd) {
  return `docker compose -f $(wp-env install-path)/docker-compose.yml exec mysql mysql -uroot -ppassword ${cmd}`
};

function mysqlRootCommandNoTTY (cmd) {
  return `docker compose -f $(wp-env install-path)/docker-compose.yml exec -T mysql mysql -uroot -ppassword ${cmd}`
};

function createDatabase (dbName) {
  mysqlRootExec(`-e \\
    "CREATE DATABASE IF NOT EXISTS ${dbName}; \\
      GRANT all privileges on ${dbName}.* to 'root'@'%'; \\
      USE ${dbName};"`)
}

function importDatabase (gzFilepath, dbName) {
  mysqlRootExec('-e \'SET GLOBAL max_allowed_packet=16777216\'')
  run(`zcat < "${gzFilepath}" | LANG=C sed '/@@GLOBAL.GTID_PURGED=/d' | ${mysqlRootCommandNoTTY(dbName)}`)
  // Fix GTID_PURGED value issue
  // mysqlRootExec -D ${dbName} -e 'RESET MASTER'
}

function useDatabase (dbName) {
  run(`wp-env run cli config set DB_NAME ${dbName}`)
}

function databaseExists (dbName) {
  const dbExists = String.fromCharCode(
    ...mysqlRootExecNoTTY(`-e 'SELECT SCHEMA_NAME \
    FROM INFORMATION_SCHEMA.SCHEMATA \
    WHERE SCHEMA_NAME = "${dbName}"'`, { stdio: 'pipe' })
  ).trim().length > 0

  if (!dbExists) {
    return false
  }

  const dbHasWpTables = String.fromCharCode(
    ...mysqlRootExecNoTTY(`-D ${dbName} -e 'SHOW TABLES LIKE "wp_posts"'`, { stdio: 'pipe' })
  ).trim().length > 0

  return dbHasWpTables
}

module.exports = {
  mysqlRootExec,
  mysqlRootExecNoTTY,
  mysqlRootCommand,
  mysqlRootCommandNoTTY,
  createDatabase,
  importDatabase,
  useDatabase,
  databaseExists
}
