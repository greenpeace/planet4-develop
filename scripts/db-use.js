const { useDatabase } = require('./lib/mysql')

if (!process.argv[2]) {
  console.log('Please use npm run db:use <dataase name>')
  process.exit(1)
}

const dbName = process.argv[2]

if (!dbName.match(/^[a-z0-9_]*$/)) {
  console.log(`DB name <${dbName}> is invalid. Please use ^[a-z0-9_]*$`)
  process.exit(1)
}

useDatabase(dbName)
