const {existsSync, mkdirSync} = require('fs');
const {run} = require('./run');
const {download} = require('./download');
const {createDatabase, importDatabase, useDatabase} = require('./mysql');
const {createAdminUser} = require('./admin-user');

function importDefaultContent(dbVersion) {
  if (!existsSync('content')) {
    mkdirSync('content');
  }
  const dbName = 'planet4_dev';
  const dbDump = `planet4-defaultcontent_wordpress-${dbVersion}.sql.gz`;

  // Make sure to remove the exising databases
  run('rm -rf planet4-defaultcontent_wordpress-*.sql.gz');

  download(
    `https://storage.googleapis.com/planet4-default-content/${dbDump}`,
    `content/${dbDump}`
  );

  try {
    createDatabase(dbName);
  } catch (error) {
    console.error('\x1b[1m\x1b[31m', 'Error:', '\x1b[0m', 'mysql container is not running!');
    process.exit(1);
  }
  importDatabase(`content/${dbDump}`, dbName);

  useDatabase(dbName);
  createAdminUser();
}

module.exports = {
  importDefaultContent,
};
