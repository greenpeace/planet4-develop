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

module.exports = {
  mysqlRootExec,
  mysqlRootExecNoTTY,
  mysqlRootCommand,
  mysqlRootCommandNoTTY
}

