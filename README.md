
# Requirements

- docker
- docker-compose
- node
- nvm
- wp-env

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

# Resources

- https://github.com/WordPress/developer-blog-content/issues/89

# To do

## Perfs
- Add Redis server to check if instance is faster that way

## Permissions
- add fix_permissions function
- check why everything is root (missing user with UID used by wp-env ?)

## NRO
- Full dev install
  - Clone dev repo, merge composer, install
  - Fetch DB, import and switch

## Team
- Pull & activate child-theme individually

## Functions
- get_x_from_repo
- get_x_from_release
- build_assets
- import DB
