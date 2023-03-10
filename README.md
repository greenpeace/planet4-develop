
# Requirements

- docker, docker-compose
  - https://docs.docker.com/get-docker/
- node, npm, nvm
  - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
  - https://github.com/nvm-sh/nvm
- curl
- wp-env
  - `npm -g i @wordpress/env`
- _optional: gsutil CLI_
  - https://cloud.google.com/storage/docs/gsutil_install

# Before anything

- Clone this repo
- Set node version
```console
> nvm use
```

# Installation

```console
> npm run env:install
```

# Clean up

```console
> npm run env:clean
```

# All commands
```
npm run
- env:install                       Install default Planet 4 theme and database
- env:clean                         Clean containers and delete all Planet 4 files
- env:config                        Show generated configuration
- env:fix-permissions [all]         Fix files permissions to current user as owner
- env:clean-repos                   Remove main repos if they are not git repositories
- nro:install <?nro>                Install NRO theme and database, if declared in .p4-env.json
- nro:enable                        Enable installed NRO theme and database
- nro:disable                       Switch back to default theme and database
- nro:theme <?nro>                  Clone NRO theme in themes dir
- build:assets                      Build main repos assets
- build:repos                       Clone and install main repos
- db:import <dump path> <db name>   Import database dump (gzip)
- db:use <db name>                  Switch to database
```

# Resources

- https://github.com/WordPress/developer-blog-content/issues/89

# To do

## Perfs
- Add Redis server to check if instance is faster that way

## Permissions
- check why everything is root (missing user with UID used by wp-env ?)
  - https://github.com/WordPress/gutenberg/issues/28201 maybe

## NRO
- Full dev install
  - Fetch DB, import and switch

## Team
- Pull & activate child-theme individually

## Images
- dl default content
- reverse proxy
  - similar to nginx, but for Apache2

## Rewrite rules
- adapt to Apache2
- make it work for wpml urls
