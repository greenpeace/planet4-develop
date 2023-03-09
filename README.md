
# Requirements

- docker, docker-compose
  - https://docs.docker.com/get-docker/
- node, npm, nvm
  - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
  - https://github.com/nvm-sh/nvm
- wp-env
  - `npm -g i @wordpress/env`
- curl
- optional: gsutil CLI
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
- env:clean                         Clean containers and delete Planet 4 files
- env:config                        Show generated configuration
- env:fix-permissions [all]         Fix files permissions to current user as owner
- nro:install <?nro>                Install NRO theme and database, if declared in .p4-env.json
- nro:enable                        Enable installed NRO theme and database
- nro:disable                       Switch back to default theme and database
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

## NRO
- Full dev install
  - Fetch DB, import and switch

## Team
- Pull & activate child-theme individually

## Images
- dl default content, map uploads directory
- reverse proxy
  - similar to nginx, but for Apache2
