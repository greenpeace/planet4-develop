const { run } = require('./lib/run');

run('sudo find ./planet4/themes/planet4-master-theme -not -user $(whoami) -exec chown -f $(whoami) {} \\+');
run('sudo find ./planet4/plugins/planet4-plugin-gutenberg-blocks -not -user $(whoami) -exec chown -f $(whoami) {} \\+');
