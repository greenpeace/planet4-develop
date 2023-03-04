#!/usr/bin/env bash
set -ae

mkdir -p planet4

echo "Cloning repos ..."
# Base
git clone git@github.com:greenpeace/planet4-base.git planet4/planet4-base
# Main repos for P4 devs
git clone git@github.com:greenpeace/planet4-master-theme.git planet4/themes/planet4-master-theme
git clone --recurse-submodules --shallow-submodules git@github.com:greenpeace/planet4-plugin-gutenberg-blocks.git planet4/plugins/planet4-plugin-gutenberg-blocks

echo "Starting environment ..."
wp-env start --update

echo "Merging composer requirements ..."
# Use base composer file
cp planet4/planet4-base/composer.json planet4/
# Adapt composer.json to local needs
wp-env run composer -d /app/planet4/ config --unset repositories.0
wp-env run composer -d /app/planet4/ config --unset extra.merge-plugin
wp-env run composer -d /app/planet4/ config --json extra.installer-paths '"{\"plugins/{\$name}/\": [\"type:wordpress-plugin\"],\"themes/{\$name}/\": [\"type:wordpress-theme\"]}"'
wp-env run composer -d /app/planet4/ config platform.php "7.4"
# Don't overwrite existing main repos
if [[ -d planet4/themes/planet4-master-theme ]]; then
  wp-env run composer -d /app/planet4/ remove --no-update greenpeace/planet4-master-theme
fi
if [[ -d planet4/plugins/planet4-plugin-gutenberg-blocks ]]; then
  wp-env run composer -d /app/planet4/ remove --no-update greenpeace/planet4-plugin-gutenberg-blocks
fi
echo "Installing themes and plugins ..."
# Install themes/plugins
wp-env run composer -d /app/planet4/ install  --ignore-platform-reqs

wp-env run composer -d /app/planet4/themes/planet4-master-theme config platform.php "7.4"
wp-env run composer -d /app/planet4/themes/planet4-master-theme install --ignore-platform-reqs
wp-env run composer -d /app/planet4/plugins/planet4-plugin-gutenberg-blocks config platform.php "7.4"
wp-env run composer -d /app/planet4/plugins/planet4-plugin-gutenberg-blocks install --ignore-platform-reqs

# Generate assets
if [ ! -d "./planet4/themes/planet4-master-theme/assets/build" ]; then
  # echo "Fixing permission issues ..."
  # sudo find ./planet4/themes/planet4-master-theme -not -user $(whoami) -exec chown -f $(whoami) {} \+
  # sudo find ./planet4/plugins/planet4-plugin-gutenberg-blocks -not -user $(whoami) -exec chown -f $(whoami) {} \+
  echo "Generating assets ..."
  export PUPPETEER_SKIP_DOWNLOAD=true
  export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
  (cd planet4/themes/planet4-master-theme && npm install)
  (cd planet4/themes/planet4-master-theme && npm run build)
  (cd planet4/plugins/planet4-plugin-gutenberg-blocks && npm install)
  (cd planet4/plugins/planet4-plugin-gutenberg-blocks && npm run build)
fi

# ## Plugin activation
wp-env run cli plugin activate --all

# Database
function mysql_root_exec() {
  docker-compose -f $(wp-env install-path)/docker-compose.yml exec mysql \
    mysql -uroot -ppassword "$@"
}

function mysql_root_exec_notty() {
  docker-compose -f $(wp-env install-path)/docker-compose.yml exec -T mysql \
    mysql -uroot -ppassword "$@"
}

echo "Downloading default content DB"
mkdir -p content
curl --fail https://storage.googleapis.com/planet4-default-content/planet4-defaultcontent_wordpress-v0.2.13.sql.gz > content/planet4-defaultcontent_wordpress-v0.2.13.sql.gz

mysql_root_exec -e \
  "CREATE DATABASE IF NOT EXISTS planet4_dev; \
    GRANT all privileges on planet4_dev.* to 'root'@'%'; \
    USE planet4_dev;"

mysql_root_exec -e 'SET GLOBAL max_allowed_packet=16777216'
zcat < "content/planet4-defaultcontent_wordpress-v0.2.13.sql.gz" | mysql_root_exec_notty "planet4_dev"
# Fix GTID_PURGED value issue
# mysql_root_exec -D planet4_dev -e 'RESET MASTER'

wp-env run cli config set DB_NAME planet4_dev

#
# docker-compose run --rm -u $(id -u) -e HOME=/tmp cli plugin install query-monitor
#
