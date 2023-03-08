const { run } = require('./run');

function mysqlRootExec(cmd) {
  const dcCommand = mysqlRootCommand(cmd);
  return run(dcCommand);
};

function mysqlRootExecNoTTY(cmd) {
  const dcCommand = mysqlRootCommandNoTTY(cmd);
  return run(dcCommand);
};

function mysqlRootCommand(cmd) {
  return `docker-compose -f \$(wp-env install-path)/docker-compose.yml exec mysql mysql -uroot -ppassword ${cmd}`;
};

function mysqlRootCommandNoTTY(cmd) {
  return `docker-compose -f \$(wp-env install-path)/docker-compose.yml exec -T mysql mysql -uroot -ppassword ${cmd}`;
};

function createDatabase(dbName) {
  mysqlRootExec(`-e \\
    "CREATE DATABASE IF NOT EXISTS ${dbName}; \\
      GRANT all privileges on ${dbName}.* to 'root'@'%'; \\
      USE ${dbName};"`);
}

function importDatabase(gzFilepath, dbName) {
  mysqlRootExec('-e \'SET GLOBAL max_allowed_packet=16777216\'');
  run(`zcat < "${gzFilepath}" | ${mysqlRootCommandNoTTY(dbName)}`);
  // Fix GTID_PURGED value issue
  // mysqlRootExec -D ${dbName} -e 'RESET MASTER'
}

module.exports = {
  mysqlRootExec,
  mysqlRootExecNoTTY,
  mysqlRootCommand,
  mysqlRootCommandNoTTY,
  createDatabase,
  importDatabase
}

