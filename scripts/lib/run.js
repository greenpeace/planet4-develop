const { execSync } = require('child_process');

function run(cmd, opts) {
  if (process.env.VERBOSE) {
    const hasOpts = Object.keys(opts || {}).length > 0;
    let logs = ['\n', `>>> ${cmd} <<<`, '\n'];
    logs.push(hasOpts ? `>>> ${JSON.stringify(opts)}` : null);

    console.info(...logs.filter(v => !!v));
  }

  return execSync(cmd, {stdio: 'inherit', ...opts});
}

module.exports = { run };
