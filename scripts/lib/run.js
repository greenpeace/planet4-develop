const { execSync } = require('child_process');

function run(cmd, opts) {
  if (process.env.VERBOSE) {
    console.log(`>>> ${cmd}`);
  }

  return execSync(cmd, {stdio: 'inherit', ...opts});
}

module.exports = { run };
