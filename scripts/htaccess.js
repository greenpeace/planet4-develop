const {createHtaccess} = require('./lib/utils');
const {getConfig} = require('./lib/config');
const {run} = require('./lib/run');

const config = getConfig();
createHtaccess(config);
run('cat content/.htaccess');
