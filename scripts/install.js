const { execSync } = require('child_process');
const { renameSync, readFileSync, writeFileSync, existsSync, lstatSync, mkdirSync, copyFileSync } = require('fs');
const { run } = require('./lib/run');
const { getMainReposFromGit } = require('./lib/get-main-repos');
const { mysqlRootExec, mysqlRootExecNoTTY, mysqlRootCommand, mysqlRootCommandNoTTY } = require('./lib/mysql');

const wpEnvConfig = JSON.parse(readFileSync('./.wp-env.json'));
const nodeVersionRequired = parseInt(readFileSync('.nvmrc'));
const config = {
    appDir: 'planet4',
    nodeVersion: nodeVersionRequired,
    ...wpEnvConfig
};
console.log(process.cwd(), config);
const baseDir = `${config.appDir}/planet4-base`;
const themeDir = config.mappings['wp-content/themes'];
const pluginDir = config.mappings['wp-content/plugins'];

/**
 * Node version control
 */
console.log('Node version: ' + process.version);
const nodeVersionRunning = parseInt(process.version.split('.')[0].substr(1)); // <string> "vX.Y.Z" => <int> X
if (nodeVersionRunning !== nodeVersionRequired) {
    console.error(`This install requires Node version ${nodeVersionRequired}. You can run <nvm use> to switch version.`);
    process.exit(1);
}

/**
 * Install main repos
 */
console.log('Cloning base repo ...');
console.log(`>>> ${baseDir}`);
if (existsSync(`${baseDir}`) && lstatSync(`${baseDir}`).isDirectory()) {
    run('git status', {cwd: `${baseDir}`});
} else {
    run(`git clone git@github.com:greenpeace/planet4-base.git ${baseDir}`);
}

console.log('Cloning main repos ...');
getMainReposFromGit({themeDir, pluginDir});

/**
 * Start WP
 */
run('wp-env start --update');

/**
 * Merge composer requirements
 */
console.log('Merging composer requirements ...');
copyFileSync(`${baseDir}/composer.json`, `${config.appDir}/composer.json`);
run(`wp-env run composer -d /app/${config.appDir}/ config --unset repositories.0`);
run(`wp-env run composer -d /app/${config.appDir}/ config --unset extra.merge-plugin`);
run(`wp-env run composer -d /app/${config.appDir}/ config --json extra.installer-paths '"{\\"plugins/{\\$name}/\\": [\\"type:wordpress-plugin\\"],\\"themes/{\\$name}/\\": [\\"type:wordpress-theme\\"]}"'`);
run(`wp-env run composer -d /app/${config.appDir}/ config platform.php "${config.phpVersion}"`);
if (existsSync(`${themeDir}/planet4-master-theme`)
    && lstatSync(`${themeDir}/planet4-master-theme`).isDirectory()
) {
    run('wp-env run composer -d /app/planet4/ remove --no-update greenpeace/planet4-master-theme');
}
if (existsSync(`${pluginDir}/planet4-plugin-gutenberg-blocks`)
    && lstatSync(`${pluginDir}/planet4-plugin-gutenberg-blocks`).isDirectory()
) {
    run('wp-env run composer -d /app/planet4/ remove --no-update greenpeace/planet4-plugin-gutenberg-blocks');
}

/**
 * Install themes/plugins
 */
console.log('Installing themes and plugins ...');
run(`wp-env run composer -d /app/${config.appDir}/ install  --ignore-platform-reqs`);
run(`wp-env run composer -d /app/${themeDir}/planet4-master-theme config platform.php "${config.phpVersion}"`);
run(`wp-env run composer -d /app/${themeDir}/planet4-master-theme install --ignore-platform-reqs`);
run(`wp-env run composer -d /app/${pluginDir}/planet4-plugin-gutenberg-blocks config platform.php "${config.phpVersion}"`);
run(`wp-env run composer -d /app/${pluginDir}/planet4-plugin-gutenberg-blocks install --ignore-platform-reqs`);

if (!existsSync(`${themeDir}/planet4-master-theme/assets/build`)) {
  console.log('Generating assets ...');
  process.env.PUPPETEER_SKIP_DOWNLOAD = true;
  process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true;
  run('npm install && npm run build', {cwd: `${themeDir}/planet4-master-theme`});
  run('npm install && npm run build', {cwd: `${pluginDir}/planet4-plugin-gutenberg-blocks`});
}

run('wp-env run cli plugin activate --all');

/**
 * Database
 */
if (!existsSync('content')) {
    mkdirSync('content');
}
run('curl --fail https://storage.googleapis.com/planet4-default-content/planet4-defaultcontent_wordpress-v0.2.13.sql.gz > content/planet4-defaultcontent_wordpress-v0.2.13.sql.gz');

const dbName = 'planet4_dev';
mysqlRootExec(`-e \\
  "CREATE DATABASE IF NOT EXISTS planet4_dev; \\
    GRANT all privileges on ${dbName}.* to 'root'@'%'; \\
    USE ${dbName};"`);

mysqlRootExec('-e \'SET GLOBAL max_allowed_packet=16777216\'');
run(`zcat < "content/planet4-defaultcontent_wordpress-v0.2.13.sql.gz" | ${mysqlRootCommandNoTTY(dbName)}`);
// Fix GTID_PURGED value issue
// mysql_root_exec -D planet4_dev -e 'RESET MASTER'

run(`wp-env run cli config set DB_NAME ${dbName}`);
run('wp-env run cli user update admin --user_pass=admin --role=administrator');
