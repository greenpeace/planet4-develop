const {existsSync, mkdirSync} = require('fs');
const {wp} = require('./run');
const {download} = require('./download');
const {createDatabase, importDatabase, useDatabase} = require('./mysql');

function importDefaultContent(dbVersion) {
  if (!existsSync('content')) {
    mkdirSync('content');
  }
  const dbName = 'planet4_dev';
  const dbDump = `planet4-defaultcontent_wordpress-${dbVersion}.sql.gz`;

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
  try {
    wp('user create admin admin@planet4.test --user_pass=admin --role=administrator');
  } catch (error) {
    wp('user update admin --user_pass=admin --user_email=admin@planet4.test --role=administrator');
  }
}

module.exports = {
  importDefaultContent,
};
