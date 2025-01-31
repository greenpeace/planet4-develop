const {runInWpContainer} = require('./lib/run');
const {getConfig} = require('./lib/config');
const {parseArgs} = require('./lib/utils');

const config = getConfig();
const rootPath = config.paths.container.app.replace('/wp-content', '');
const themePath = `${rootPath}/${config.paths.container.themes}/planet4-master-theme`;

const args = parseArgs(process.argv, {command: 'lint'}); // lint, fix, test

if (args.command === 'lint') {
  runInWpContainer('./vendor/bin/phpcs src/ page-templates/ tests/', {working_dir: themePath});
}

if (args.command === 'fix') {
  runInWpContainer('./vendor/bin/phpcbf src/ page-templates/ tests/', {working_dir: themePath});
}

if (args.command === 'test') {
  runInWpContainer('./vendor/bin/phpunit', {working_dir: themePath});
}
