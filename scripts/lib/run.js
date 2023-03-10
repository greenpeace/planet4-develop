const { execSync } = require('child_process')

function run (cmd, opts) {
  if (process.env.VERBOSE) {
    const logs = ['\n', `>>> ${cmd} <<<`]
    if (Object.keys(opts || {}).length > 0) {
      logs.push('\n')
      logs.push(`>>> ${JSON.stringify(opts)}`)
    }
    logs.push('\n')

    console.info(...logs.filter(v => !!v))
  }

  return execSync(cmd, { stdio: 'inherit', ...opts })
}

module.exports = { run }
