const usage = `
  Lifecycle scripts included in Planet 4 develop environment:

  available via \`npm run-script\`:
    env:requirements                  Check requirements
    env:install                       Install default Planet 4 theme and database
    env:start                         Start the environment
    env:stop                          Stop the environment
    env:clean                         Clean wp-env and delete all Planet 4 files
    env:destroy                       Delete all wp-env and Planet 4 files and containers
    env:config                        Show generated configuration
    env:fix-permissions [all]         Fix files permissions to current user as owner
    env:clean-repos                   Remove main repos if they are not git repositories
    env:update                        Update installer, base and main repos
    env:status                        Status of docker containers
    env:e2e-install                   Install E2E tests dependencies
    env:e2e                           Run E2E tests on local instance

    nro:install <?nro>                Install NRO theme and database
    nro:enable                        Enable installed NRO theme and database
    nro:disable                       Switch back to default theme and database
    nro:theme <?nro>                  Clone NRO theme in themes dir

    build:assets                      Build main repos assets
    build:repos                       Clone and install main repos

    db:import <dump path> <db name>   Import database dump (gzip)
    db:use <db name>                  Switch to database

    shell:php                         Access PHP shell (WordPress container)
    shell:mysql                       Access MySQL console (current database)

    elastic:activate                  Activate ElasticSearch container and plugin
    elastic:deactivate                Deactivate ElasticSearch container and plugin

    xdebug:install                    Install Xdebug in WordPress container
    xdebug:configure                  Rewrite Xdebug configuration and reload server
    xdebug:flamegraph <trace>         Generate a flamegraph from a Xdebug trace file
`;

console.log('%s', usage);
