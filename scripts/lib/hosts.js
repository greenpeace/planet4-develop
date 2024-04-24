const os = require('node:os');
const {readFileSync} = require('fs');
const {run} = require('./run');

function isWsl() {
  return os.release().toLowerCase().includes('microsoft');
}

function configureWindowsHosts() {
  const hostsFile = '/mnt/c/Windows/System32/drivers/etc/hosts';
  try {
    const data = readFileSync(hostsFile);

    if (data.includes('www.planet4.test')) {
      console.log('Windows hosts file is already configured.');
    }
    else {
      run(`cp ${hostsFile} hosts.windows.backup`);

      console.log('Your Windows hosts file has been backed up to hosts.windows.backup');
      console.log(`May require sudo password to configure the ${hostsFile} file.`);

      run(`echo \"\n# Planet 4 local development environment\n127.0.0.1\twww.planet4.test\" | sudo tee -a ${hostsFile}`);
    }
  } catch (e) {
    console.log('\nWSL is detected, but Windows hosts file is not accessible, please be sure to add Planet4 configuration to it:');
    console.log('127.0.0.1\twww.planet4.test');
  }
}

function configureHosts () {
  const data = readFileSync('/etc/hosts');

  if (data.includes('www.planet4.test')) {
    console.log('Hosts file is already configured.');
  } else {
    run('cp /etc/hosts hosts.backup');

    console.log('Your hosts file has been backed up to hosts.backup');
    console.log('May require sudo password to configure the /etc/hosts file.');

    run('echo \"\n# Planet 4 local development environment\n127.0.0.1\twww.planet4.test\" | sudo tee -a /etc/hosts');
  }

  if (isWsl()) {
    configureWindowsHosts();
  }
}

module.exports = {configureHosts};
