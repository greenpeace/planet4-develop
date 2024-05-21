The project could not be installed on my system.

Following the documentation steps does not make the project run. There's two caveats:
1. `nvm` is not a tool within the Linux distribution that I am using (NixOS 23.11 (Tapir)), as there is a builtin "version manager" in the system. This builtin version manager allows me to run Node.js 16 like normal, where `node -v` outputs Node.js 16. 
2. `/etc/hosts` is not editable by regular programs like these but after reading the script I see that the only thing to add was 127.0.0.1 to planet4.test, which I did.

Both of these caveats should however not make a difference. I don't seem to get to a point where the content of `/etc/hosts` matters.

The log:

```
~ 
❯ cd ~/Projects/planet4-develop 

planet4-develop on  main [!+?] is 📦 v0.12.0 via  v18.19.1 
❯ nix develop
warning: Git tree '/home/rbozan/Projects/planet4-develop' is dirty

planet4-develop on  main [!+?⇣] is 📦 v0.12.0 via  v16.14.0 via ❄️  impure (nix-shell-env) 
❯ npm install

> planet4-develop@0.12.0 prepare
> husky install

husky - Git hooks installed

up to date, audited 697 packages in 2s

190 packages are looking for funding
  run `npm fund` for details

2 moderate severity vulnerabilities

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

planet4-develop on  main [!+?⇣] is 📦 v0.12.0 via  v16.14.0 via ❄️  impure (nix-shell-env) 
❯ ^C

planet4-develop on  main [!+?⇣] is 📦 v0.12.0 via  v16.14.0 via ❄️  impure (nix-shell-env) 
❯ rm node_modules -rf
npm
planet4-develop on  main [!+?⇣] is 📦 v0.12.0 via  v16.14.0 via ❄️  impure (nix-shell-env) 
❯ npm install

> planet4-develop@0.12.0 prepare
> husky install

husky - Git hooks installed

added 696 packages, and audited 697 packages in 5s

190 packages are looking for funding
  run `npm fund` for details

2 moderate severity vulnerabilities

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

planet4-develop on  main [!+?⇣] is 📦 v0.12.0 via  v16.14.0 via ❄️  impure (nix-shell-env) took 4s 
❯ ^C

planet4-develop on  main [!+?⇣] is 📦 v0.12.0 via  v16.14.0 via ❄️  impure (nix-shell-env) 
❯ npm run env:requirements

> planet4-develop@0.12.0 env:requirements
> node ./scripts/requirements.js

Shell: 
/run/current-system/sw/bin/zsh
Node version: v16.14.0

Docker version:
✓ Found: Docker version 24.0.5, build v24.0.5

Docker compose version:
✓ Found: Docker Compose version 2.23.1

wp-env version:
✓ Found: 9.4.0

nvm version:
✗ Not found (nvm path used: ~/.nvm/nvm.sh). Please install NVM.

curl version:
✓ Found: curl 8.4.0 (x86_64-pc-linux-gnu) libcurl/8.4.0 OpenSSL/3.0.13 zlib/1.3 brotli/1.1.0 zstd/1.5.5 libidn2/2.3.4 libssh2/1.11.0 nghttp2/1.57.0
Release-Date: 2023-10-11
Protocols: dict file ftp ftps gopher gophers http https imap imaps mqtt pop3 pop3s rtsp scp sftp smb smbs smtp smtps telnet tftp
Features: alt-svc AsynchDNS brotli GSS-API HSTS HTTP2 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM SPNEGO SSL threadsafe TLS-SRP UnixSockets zstd

gcloud version:
✗ Not found. Install gcloud only if you want to import NRO database.

New Planet 4 developer environment release available: v0.14.0
You should update !

Your local commit (2f926271066e7d07165c343c1f2d4531014f2c8d) does not match the latest release commit (main)

planet4-develop on  main [!+?⇣] is 📦 v0.12.0 via  v16.14.0 via ❄️  impure (nix-shell-env) took 2s 
❯ git pull
Updating 2f92627..148464b
Fast-forward
 .wp-env.json      | 2 +-
 package-lock.json | 4 ++--
 package.json      | 2 +-
 3 files changed, 4 insertions(+), 4 deletions(-)

planet4-develop on  main [!+?] is 📦 v0.14.0 via  v16.14.0 via ❄️  impure (nix-shell-env) 
❯ npm run env:requirements

> planet4-develop@0.14.0 env:requirements
> node ./scripts/requirements.js

Shell: 
/run/current-system/sw/bin/zsh
Node version: v16.14.0

Docker version:
✓ Found: Docker version 24.0.5, build v24.0.5

Docker compose version:
✓ Found: Docker Compose version 2.23.1

wp-env version:
✓ Found: 9.4.0

nvm version:
✗ Not found (nvm path used: ~/.nvm/nvm.sh). Please install NVM.

curl version:
✓ Found: curl 8.4.0 (x86_64-pc-linux-gnu) libcurl/8.4.0 OpenSSL/3.0.13 zlib/1.3 brotli/1.1.0 zstd/1.5.5 libidn2/2.3.4 libssh2/1.11.0 nghttp2/1.57.0
Release-Date: 2023-10-11
Protocols: dict file ftp ftps gopher gophers http https imap imaps mqtt pop3 pop3s rtsp scp sftp smb smbs smtp smtps telnet tftp
Features: alt-svc AsynchDNS brotli GSS-API HSTS HTTP2 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM SPNEGO SSL threadsafe TLS-SRP UnixSockets zstd

gcloud version:
✗ Not found. Install gcloud only if you want to import NRO database.

Your local commit (148464b827113d0a1542cd8686866b7e4e210f9a) does not match the latest release commit (main)

planet4-develop on  main [!+?] is 📦 v0.14.0 via  v16.14.0 via ❄️  impure (nix-shell-env) 
❯ npm run env:install

> planet4-develop@0.14.0 env:install
> node ./scripts/install.js

Node version: v16.14.0
Configure /etc/hosts file ...
Hosts file is already configured.
/home/rbozan/Projects/planet4-develop 
 {
  paths: {
    local: {
      app: './planet4',
      common: './planet4/common',
      themes: './planet4/themes',
      plugins: './planet4/plugins',
      uploads: './planet4/uploads',
      languages: './planet4/languages'
    },
    container: {
      app: '/var/www/html/wp-content',
      common: 'wp-content/common',
      themes: 'wp-content/themes',
      plugins: 'wp-content/plugins',
      uploads: 'wp-content/uploads',
      languages: 'wp-content/languages'
    }
  },
  verbose: false,
  phpVersion: '8.1',
  core: 'WordPress/WordPress#6.5.3',
  mappings: { 'wp-content': './planet4' },
  config: {
    WP_SITEURL: 'http://www.planet4.test/',
    WP_HOME: 'http://www.planet4.test/',
    WP_APP_ENV: 'local',
    WP_CACHE: false,
    WP_DEBUG: false,
    WP_DEBUG_LOG: true,
    SCRIPT_DEBUG: true,
    QM_ENABLE_CAPS_PANEL: true
  },
  env: { development: { port: 80 } },
  planet4: {
    content: { db: 'v0.2.44', images: '1-25' },
    repos: {
      'planet4-base': 'main',
      'planet4-master-theme': 'main',
      'planet4-plugin-gutenberg-blocks': 'main'
    },
    composer: { processTimeout: '600' },
    xdebug: { version: '3.3.1', settings: [Object] }
  },
  nro: null
}
✔ Stopped WordPress. (in 1s 333ms)
WordPress development site started at http://www.planet4.test/
WordPress test site started at http://www.planet4.test:8889/
MySQL is listening on port 32768
MySQL for automated testing is listening on port 32769

 ✔ Done! (in 24s 106ms)
✔  (in 0s 629ms)
[+] Copying 1/0
 ✔ c1529ee3126d92a22c17e7bc009946ab-wordpress-1 copy content/.htaccess to c1529ee3126d92a22c17e7bc009946ab-wordpress-1:/var/www/html/.htaccess Copied                                      0.0s 
ℹ Starting 'composer config --global process-timeout 600' on the cli container. 

Composer could not detect the root package (greenpeace/planet4-base) version, defaulting to '1.0.0'. See https://getcomposer.org/root-version
✔ Ran `composer config --global process-timeout 600` in 'cli'. (in 0s 866ms)
Cloning base repo ...
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
Already on 'main'
Your branch is up to date with 'origin/main'.
Cloning and installing main repos ...
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   package-lock.json

no changes added to commit (use "git add" and/or "git commit -a")
M	package-lock.json
Already on 'main'
Your branch is up to date with 'origin/main'.
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
Already on 'main'
Your branch is up to date with 'origin/main'.
ℹ Starting 'composer install' on the cli container. 

Composer could not detect the root package (greenpeace/planet4-master-theme) version, defaulting to '1.0.0'. See https://getcomposer.org/root-version
Installing dependencies from lock file (including require-dev)
Verifying lock file contents can be installed on current platform.
Nothing to install, update or remove
Package twig/cache-extension is abandoned, you should avoid using it. Use twig/cache-extra instead.
Generating autoload files
36 packages you are using are looking for funding.
Use the `composer fund` command to find out more!
✔ Ran `composer install` in 'cli'. (in 2s 141ms)
ℹ Starting 'composer install' on the cli container. 

Composer could not detect the root package (greenpeace/planet4-plugin-gutenberg-blocks) version, defaulting to '1.0.0'. See https://getcomposer.org/root-version
Installing dependencies from lock file (including require-dev)
Verifying lock file contents can be installed on current platform.
Nothing to install, update or remove
Generating autoload files
25 packages you are using are looking for funding.
Use the `composer fund` command to find out more!
✔ Ran `composer install` in 'cli'. (in 1s 844ms)
Generating assets ...
Merging composer requirements ...
ℹ Starting 'composer config --unset repositories.0' on the cli container. 

Composer could not detect the root package (greenpeace/planet4-base) version, defaulting to '1.0.0'. See https://getcomposer.org/root-version
✔ Ran `composer config --unset repositories.0` in 'cli'. (in 0s 898ms)
ℹ Starting 'composer config --unset extra.merge-plugin' on the cli container. 

Composer could not detect the root package (greenpeace/planet4-base) version, defaulting to '1.0.0'. See https://getcomposer.org/root-version
✔ Ran `composer config --unset extra.merge-plugin` in 'cli'. (in 0s 896ms)
ℹ Starting 'composer config --json extra.installer-paths {"plugins/{nix-shell-env}/": ["type:wordpress-plugin"],"themes/{nix-shell-env}/": ["type:wordpress-theme"]}' on the cli container. 

Composer could not detect the root package (greenpeace/planet4-base) version, defaulting to '1.0.0'. See https://getcomposer.org/root-version
✔ Ran `composer config --json extra.installer-paths {"plugins/{nix-shell-env}/": ["type:wordpress-plugin"],"themes/{nix-shell-env}/": ["type:wordpress-theme"]}` in 'cli'. (in 0s 884ms)
ℹ Starting 'composer remove --no-update greenpeace/planet4-master-theme' on the cli container. 

Composer could not detect the root package (greenpeace/planet4-base) version, defaulting to '1.0.0'. See https://getcomposer.org/root-version
./composer.json has been updated
✔ Ran `composer remove --no-update greenpeace/planet4-master-theme` in 'cli'. (in 0s 950ms)
ℹ Starting 'composer remove --no-update greenpeace/planet4-plugin-gutenberg-blocks' on the cli container. 

Composer could not detect the root package (greenpeace/planet4-base) version, defaulting to '1.0.0'. See https://getcomposer.org/root-version
./composer.json has been updated
✔ Ran `composer remove --no-update greenpeace/planet4-plugin-gutenberg-blocks` in 'cli'. (in 0s 896ms)
ℹ Starting 'composer remove --no-update greenpeace/planet4-nginx-helper' on the cli container. 

Composer could not detect the root package (greenpeace/planet4-base) version, defaulting to '1.0.0'. See https://getcomposer.org/root-version
./composer.json has been updated
✔ Ran `composer remove --no-update greenpeace/planet4-nginx-helper` in 'cli'. (in 0s 853ms)
baseComposerConfig {
  name: 'greenpeace/planet4-base',
  description: 'Core Greenpeace Planet4 application',
  license: 'GPL-3.0-or-later',
  repositories: {
    '1': {
      type: 'composer',
      url: 'https://wpackagist.org',
      canonical: false
    },
    '2': {
      type: 'composer',
      url: 'https://packagist.org',
      canonical: false
    },
    '3': { type: 'package', package: [Object] },
    '4': { type: 'package', package: [Object] },
    '5': { type: 'package', package: [Object] },
    '6': { type: 'package', package: [Object] },
    '7': { type: 'package', package: [Object] },
    '8': { type: 'package', package: [Object] },
    '9': { type: 'package', package: [Object] },
    '10': { type: 'package', package: [Object] },
    '11': { type: 'package', package: [Object] },
    '12': { type: 'package', package: [Object] },
    '13': { type: 'package', package: [Object] },
    '14': { type: 'package', package: [Object] }
  },
  require: {
    'cmb2/cmb2': '2.*',
    'composer/installers': '~1.0',
    'google/apiclient': '2.15.3',
    'wikimedia/composer-merge-plugin': '2.1.*',
    'wpackagist-plugin/akismet': '5.*',
    'wpackagist-plugin/cloudflare': '4.*',
    'wpackagist-plugin/duplicate-post': '4.*',
    'wpackagist-plugin/elasticpress': '4.7.*',
    'wpackagist-plugin/google-apps-login': '3.4.6',
    'plugins/google-profile-avatars': '1.5',
    'plugins/gravityforms': '*',
    'plugins/gravityformshubspot': '*',
    'plugins/gravityformsquiz': '*',
    'wpackagist-plugin/post-type-switcher': '3.3.0',
    'wpackagist-plugin/redirection': '5.*',
    'wpackagist-plugin/wordpress-importer': '0.*',
    'wpackagist-plugin/wp-redis': '1.4.*',
    'wpackagist-plugin/wp-sentry-integration': '7.*',
    'wpackagist-plugin/wp-stateless': '3.4.1',
    'psr/log': '1.*',
    'monolog/monolog': '^2.9',
    'wpackagist-plugin/timber-library': '1.23.*',
    'timber/timber': '1.24.0'
  },
  config: {
    'secure-http': false,
    'github-protocols': [ 'https' ],
    'allow-plugins': {
      'composer/installers': true,
      'wikimedia/composer-merge-plugin': true
    }
  },
  extra: {
    'installer-paths': {
      'plugins/{nix-shell-env}/': [Array],
      'themes/{nix-shell-env}/': [Array]
    },
    'wp-version': '6.4.3'
  },
  scripts: {
    'site-install': [
      '@reset:public',
      '@download:wordpress',
      '@copy:health-check',
      '@reset:themes',
      '@reset:plugins',
      '@copy:themes',
      '@copy:plugins',
      '@core:config',
      '@core:install',
      '@plugin:activate',
      '@theme:activate',
      '@core:add-author-capabilities',
      '@core:add-contributor-capabilities',
      '@redis:enable',
      '@site:custom'
    ],
    'site-update': [
      '@download:wordpress',
      '@copy:health-check',
      '@reset:themes',
      '@reset:plugins',
      '@copy:themes',
      '@copy:plugins',
      '@core:updatedb',
      '@plugin:activate',
      '@theme:activate',
      '@core:add-contributor-capabilities',
      '@redis:enable',
      '@site:custom'
    ],
    'docker-site-install': [
      '@download:wordpress',
      '@copy:health-check',
      '@reset:themes',
      '@copy:themes',
      '@copy:plugins',
      '@core:config',
      '@core:install',
      '@plugin:activate',
      '@theme:activate',
      '@site:custom'
    ],
    'site:global': [ '@site:custom' ],
    'theme:install': [ '@copy:theme', '@theme:activate' ],
    'plugin:install': [ '@copy:plugin', '@plugin:activate' ],
    'reset:public': 'rm -rf public; mkdir public',
    'reset:themes': 'rm -rf public/wp-content/themes',
    'reset:plugins': 'rm -rf public/wp-content/plugins',
    'copy:plugins': 'rsync -arOJ vendor/plugins public/wp-content',
    'copy:themes': 'rsync -arOJ vendor/themes public/wp-content',
    'redis:enable': 'wp redis enable',
    'core:config': 'wp core config --force',
    'core:install': 'wp core install',
    'core:updatedb': 'wp core update-db',
    'core:add-author-capabilities': 'wp cap add author edit_others_posts; wp cap add author delete_others_posts; wp cap add author delete_private_posts;wp cap add author edit_private_posts;wp cap add author read_private_posts;',
    'core:add-contributor-capabilities': 'wp cap add contributor upload_files',
    'plugin:deactivate': 'wp plugin deactivate --all',
    'plugin:activate': 'wp plugin activate --all',
    'plugin:activate-only-inactive': 'inactive_plugins=$(wp plugin list --field=name --status=inactive --format=csv); wp plugin activate $inactive_plugins;',
    'theme:activate': 'wp theme activate',
    server: 'php -S 127.0.0.1:9191 -t public',
    'site:custom': ''
  }
}
Installing & activating plugins ...
ℹ Starting 'composer update' on the cli container. 

Composer could not detect the root package (greenpeace/planet4-base) version, defaulting to '1.0.0'. See https://getcomposer.org/root-version
Loading composer repositories with package information
Updating dependencies
Lock file operations: 0 installs, 1 update, 0 removals
  - Upgrading google/apiclient-services (v0.355.0 => v0.356.0)
Writing lock file
Installing dependencies from lock file (including require-dev)
Package operations: 0 installs, 1 update, 0 removals
  - Downloading google/apiclient-services (v0.356.0)
  - Upgrading google/apiclient-services (v0.355.0 => v0.356.0): Extracting archive
Package twig/cache-extension is abandoned, you should avoid using it. Use twig/cache-extra instead.
Generating autoload files
13 packages you are using are looking for funding.
Use the `composer fund` command to find out more!
Found 1 security vulnerability advisory affecting 1 package.
Run "composer audit" for a full list of advisories.
✔ Ran `composer update` in 'cli'. (in 7s 126ms)
Installing development requirements ...
content/planet4-default-content-1-25-images.zip already exists.
Importing default database ...
content/planet4-defaultcontent_wordpress-v0.2.44.sql.gz already exists.
✔  (in 0s 617ms)
✔  (in 0s 595ms)
✔  (in 0s 560ms)
ℹ Starting 'wp config set DB_NAME planet4_dev' on the cli container. 

Success: Updated the constant 'DB_NAME' in the 'wp-config.php' file with the value 'planet4_dev'.
✔ Ran `wp config set DB_NAME planet4_dev` in 'cli'. (in 0s 828ms)
ℹ Starting 'wp user create admin admin@planet4.test --user_pass=admin --role=administrator' on the cli container. 

Error: The 'admin' username is already registered.
✖ Command failed with exit code 1
Command failed with exit code 1
ℹ Starting 'wp user update admin --user_pass=admin --user_email=admin@planet4.test --role=administrator' on the cli container. 

sendmail: can't connect to remote host (127.0.0.1): Connection refused
sendmail: can't connect to remote host (127.0.0.1): Connection refused
Success: Updated user 1.
✔ Ran `wp user update admin --user_pass=admin --user_email=admin@planet4.test --role=administrator` in 'cli'. (in 0s 997ms)
ℹ Starting 'wp plugin activate --all' on the cli container. 

Plugin '{nix-shell-env}' activated.
Success: Activated 1 of 18 plugins.
✔ Ran `wp plugin activate --all` in 'cli'. (in 0s 988ms)
ℹ Starting 'wp plugin deactivate elasticpress' on the cli container. 

Warning: The 'elasticpress' plugin could not be found.
Error: No plugins deactivated.
✖ Command failed with exit code 1
Command failed with exit code 1
node:child_process:905
    throw err;
    ^

Error: Command failed: npx wp-env run cli wp plugin deactivate elasticpress
    at checkExecSyncError (node:child_process:828:11)
    at execSync (node:child_process:902:15)
    at run (/home/rbozan/Projects/planet4-develop/scripts/lib/run.js:15:10)
    at wpenvRun (/home/rbozan/Projects/planet4-develop/scripts/lib/run.js:23:10)
    at wp (/home/rbozan/Projects/planet4-develop/scripts/lib/run.js:44:10)
    at Object.<anonymous> (/home/rbozan/Projects/planet4-develop/scripts/install.js:90:1)
    at Module._compile (node:internal/modules/cjs/loader:1103:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1155:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12) {
  status: 1,
  signal: null,
  output: [ null, null, null ],
  pid: 16969,
  stdout: null,
  stderr: null
}
```

Destroying the environment using the npm command in the `package.json` and then reinstalling ends up with the same error.

planet4.test shows a blank page.
