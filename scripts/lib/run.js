const { execSync } = require('child_process');

function run(cmd, opts) {
    return execSync(cmd, {stdio: 'inherit', ...opts});
}

module.exports = { run };