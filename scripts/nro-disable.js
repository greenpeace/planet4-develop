const {wp} = require('./lib/run');
const {useDatabase} = require('./lib/mysql');

// merge composer files
// reinstall composer dependencies
// deactivate theme
// opt: switch DB

useDatabase('planet4_dev');
wp('theme activate planet4-master-theme');
