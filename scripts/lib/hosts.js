const {readFileSync} = require('fs');
const {run} = require('./run');


function configureHosts () {
  const data = readFileSync('/etc/hosts');

  if (data.includes('www.planet4.test')) {
    console.log('Hosts file is already configured.');
    process.exit(0);
  } else {
    run('cp /etc/hosts hosts.backup');

    console.log('Your hosts file has been backed up to hosts.backup');
    console.log('May require sudo password to configure the /etc/hosts file.');

    run('echo \"\n# Planet 4 local development environment\n127.0.0.1\twww.planet4.test\" | sudo tee -a /etc/hosts');
  }
}

module.exports = {configureHosts};
