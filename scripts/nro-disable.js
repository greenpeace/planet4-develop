const { run } = require('./lib/run');

// merge composer files
// reinstall composer dependencies
// deactivate theme
// opt: switch DB

run(`wp-env run cli theme activate planet4-master-theme`);
