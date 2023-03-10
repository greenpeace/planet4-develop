const { run } = require('./lib/run')
const { useDatabase } = require('./lib/mysql')

// merge composer files
// reinstall composer dependencies
// deactivate theme
// opt: switch DB

useDatabase('planet4_dev')
run('wp-env run cli theme activate planet4-master-theme')
