const {getConfig} = require('./lib/config');
const {importDefaultContent} = require('./lib/db-defaultcontent');

const config = getConfig();
importDefaultContent(config.planet4.content.db);
