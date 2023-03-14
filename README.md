
# Planet 4 development environment

![Last release](https://gitlab.com/lithrel/planet4-develop/-/badges/release.svg?order_by=release_at)
![Last pipeline result on main branch](https://gitlab.com/lithrel/planet4-develop/badges/main/pipeline.svg)

_Get a full Planet 4 development environment to your local machine_  
We are using [`wp-env`](https://github.com/WordPress/gutenberg/blob/trunk/packages/env/README.md) as a base and pulling all necessary themes and plugins so that you can develop for your website more easily.


## System Requirements

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

## Before anything

- Clone this repo
- Set node version
```console
> nvm use
```

## Installation

```console
> npm run env:install
```

## Clean up

```console
> npm run env:clean
```

## All commands
```
npm run
- env:install                       Install default Planet 4 theme and database
- env:clean                         Clean wp-env and delete all Planet 4 files
- env:config                        Show generated configuration
- env:fix-permissions [all]         Fix files permissions to current user as owner
- env:clean-repos                   Remove main repos if they are not git repositories
- env:update                        Update installer, base and main repos
- env:status                        Status of docker containers
- nro:install <?nro>                Install NRO theme and database, if declared in .p4-env.json
- nro:enable                        Enable installed NRO theme and database
- nro:disable                       Switch back to default theme and database
- nro:theme <?nro>                  Clone NRO theme in themes dir
- build:assets                      Build main repos assets
- build:repos                       Clone and install main repos
- db:import <dump path> <db name>   Import database dump (gzip)
- db:use <db name>                  Switch to database
```

## Resources

- https://github.com/WordPress/gutenberg/tree/trunk/packages/env
- https://github.com/WordPress/developer-blog-content/issues/89

## To do

### Perfs
- Add Redis server to check if instance is faster that way

### Permissions
- check why everything is root (missing user with UID used by wp-env ?)
  - https://github.com/WordPress/gutenberg/issues/28201 maybe

### Composer
- execute @site:custom scripts
  - figure out replacement of `wp` commands 

### Images
- reverse proxy
  - similar to nginx, but for Apache2

### Rewrite rules
- adapt to Apache2

### WPML
- String Translation issues writing in languages folder
