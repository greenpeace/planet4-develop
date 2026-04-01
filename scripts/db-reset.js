const {getConfig} = require('./lib/config');
const {importDefaultContent} = require('./lib/db-defaultcontent');
const {disableSso} = require('./lib/utils');

const config = getConfig();
importDefaultContent(config.planet4.content.db);
disableSso();
