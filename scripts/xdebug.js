const {run, runInWpContainer} = require('./lib/run');
const {parseArgs} = require('./lib/utils');
const {getConfig} = require('./lib/config');

const config = getConfig();
const xdebug = config.planet4.xdebug;

const args = parseArgs(process.argv, {command: 'install'});

if (args.command === 'install') {
  runInWpContainer(`pecl install xdebug-${xdebug.version || '3.3.1'}`);
  runInWpContainer('docker-php-ext-enable xdebug');
}

if (args.command === 'install' || args.command === 'configure') {
  const xdebugIni = '/usr/local/etc/php/conf.d/99-xdebug.ini';
  runInWpContainer(`touch ${xdebugIni}`);
  runInWpContainer(`bash -c "echo -n > ${xdebugIni}"`);
  for (const k in xdebug.settings) {
    runInWpContainer(`bash -c "echo '${k} = ${xdebug.settings[k]}' >> ${xdebugIni}"`);
  }
  runInWpContainer('sudo apache2ctl graceful');
}

if (args.command === 'flamegraph') {
  run('git clone git@github.com:brendangregg/FlameGraph.git planet4/flamegraph || true');
  console.log('Generating flamegraph, this might take a few minutes ...');

  const filename = args.targets[0];
  if (filename.endsWith('.gz')) {
    run(`zcat ${filename} | planet4/flamegraph/flamegraph.pl > ${filename}.svg`);
  } else {
    run(`planet4/flamegraph/flamegraph.pl ${filename} > ${filename}.svg`);
  }
  console.log(`Flamegraph SVG available: ${filename}.svg`);
}
