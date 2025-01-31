const {getConfig} = require('./lib/config');
const {run} = require('./lib/run');

const all = process.argv[2] || null;
const config = getConfig();

if (all) {
  run(
    `sudo find ${config.paths.local.app} -not -user $(whoami) -exec chown -f $(whoami) {} \\+`
  );
  run(`sudo chmod 777 ${config.paths.local.uploads}`);
} else {
  run(
    `sudo find ${config.paths.local.themes}/planet4-master-theme -not -user $(whoami) -exec chown -f $(whoami) {} \\+`
  );
}
