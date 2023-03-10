const { getConfig } = require('./lib/config')
const { buildAssets } = require('./lib/main-repos')

buildAssets(getConfig(), true)
