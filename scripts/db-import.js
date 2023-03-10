const { existsSync } = require('fs')
const { run } = require('./lib/run')
const { createDatabase, importDatabase, useDatabase } = require('./lib/mysql')

if (!process.argv[2] || !process.argv[3]) {
  console.log('Please use npm run db:import <gz file path> <dataase name>')
  process.exit(1)
}

const filepath = process.argv[2]
const dbName = process.argv[3]

if (!existsSync(filepath)) {
  console.log(`File <${filepath}> is not accessible.`)
  process.exit(1)
}

if (!dbName.match(/^[a-z0-9_]*$/)) {
  console.log(`DB name <${dbName}> is invalid. Please use ^[a-z0-9_]*$`)
  process.exit(1)
}

createDatabase(dbName)
importDatabase(filepath, dbName)
useDatabase(dbName)
run('wp-env run cli user update admin --user_pass=admin --role=administrator')
