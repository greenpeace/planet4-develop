const { run } = require('./lib/run')
const { getConfig } = require('./lib/config')
const { nodeCheck } = require('./lib/node-check')
const { parseArgs } = require('./lib/utils')

/**
 * Node version control
 */
console.log('Node version: ' + process.version)
nodeCheck()

/**
 * Config
 */
const config = getConfig()
console.log(process.cwd(), '\n', config)

/**
 * Main
 */
const args = parseArgs(process.argv, { command: 'run' })

if (args.command === 'install') {
  run(`npx playwright install ${args.options.join(' ')}`, { cwd: `${config.themesDir}/planet4-master-theme` })
  run(`npx playwright install ${args.options.join(' ')}`, { cwd: `${config.pluginsDir}/planet4-plugin-gutenberg-blocks` })
}

if (args.command === 'run') {
  run(`npx playwright test ${args.options.join(' ')} --pass-with-no-tests`, { cwd: `${config.themesDir}/planet4-master-theme` })
  run(`npx playwright test ${args.options.join(' ')} --pass-with-no-tests`, { cwd: `${config.pluginsDir}/planet4-plugin-gutenberg-blocks` })
}
