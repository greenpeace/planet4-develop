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

function runWithOutput (cmd, opts) {
  return String.fromCharCode(...run(cmd, { stdio: 'pipe', ...opts })).trim()
}

function wpenvRun (cmd, cwd, opts = {}) {
  run(
    cwd ? `wp-env run --env-cwd=${cwd} ${cmd}` : `wp-env run ${cmd}`,
    opts
  )
}

function cli (cmd) {
  return wpenvRun(`cli ${cmd}`)
}

function composer (cmd, cwd) {
  if (process.env.VERBOSE) {
    console.log(cmd, cwd)
  }
  return wpenvRun(
    `cli composer ${cmd}`,
    cwd && cwd.startsWith('/') ? cwd : `/var/www/html/${cwd}`
  )
}

function wp (cmd, opts) {
  return wpenvRun(`cli wp ${cmd}`, null, opts)
}

module.exports = { run, runWithOutput, cli, composer, wp }
