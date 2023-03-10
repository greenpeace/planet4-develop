const { getConfig } = require('./lib/config')
const { run } = require('./lib/run')

const all = process.argv[2] || null
const config = getConfig()

if (all) {
  run(`sudo find ${config.appDir} -not -user $(whoami) -exec chown -f $(whoami) {} \\+`)
} else {
  run(`sudo find ${config.themesDir}/planet4-master-theme -not -user $(whoami) -exec chown -f $(whoami) {} \\+`)
  run(`sudo find ${config.pluginsDir}/planet4-plugin-gutenberg-blocks -not -user $(whoami) -exec chown -f $(whoami) {} \\+`)
}
