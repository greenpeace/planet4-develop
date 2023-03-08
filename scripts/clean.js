const { run } = require('./lib/run');

run('wp-env stop');
run('wp-env clean');
console.log('Deleting all files in ./planet4/ ...')
run('sudo rm -rf planet4');
