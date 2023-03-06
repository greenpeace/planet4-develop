const { execSync } = require('child_process');

function mysqlRootExec(cmd) {
  const dcCommand = mysqlRootCommand(cmd);
  console.log(dcCommand);
  return execSync(dcCommand, {stdio: 'inherit'});
};

function mysqlRootExecNoTTY(cmd) {
  const dcCommand = mysqlRootCommandNoTTY(cmd);
  console.log(dcCommand);
  return execSync(dcCommand, {stdio: 'inherit'});
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

