const { run } = require('./lib/run');

run('wp-env stop');
run('wp-env clean');
run('sudo rm -rf planet4');
