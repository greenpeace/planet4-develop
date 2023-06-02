const assert = require('assert')
const { getConfig } = require('../scripts/lib/config')

describe('Config', () => {
  it('Config override works', () => {
    const override = { app: 'foo', env: { development: { port: 99 } } }
    const config = getConfig(override)

    assert.ok(config.app === 'foo')
    assert.ok(config.env.development.port === 99)
  })

  it('NRO config should be defined by name only', () => {
    const nroName = 'foobar'
    const override = { nro: { name: 'foobar', foo: 'bar' } }
    const config = getConfig(override)

    assert.ok(config.nro.name.includes(nroName))
    assert.ok(config.nro.dir.includes(nroName))
    assert.ok(config.nro.db.includes(nroName))
    assert.ok(config.nro.dbBucket.includes(nroName))
    assert.ok(config.nro.imgBucket.includes(nroName))
  })

  it('NRO config override should merge ', () => {
    const nroName = 'foobar'
    const override = { nro: { name: 'foobar', foo: 'bar', db: 'foo_db' } }
    const config = getConfig(override)

    assert.ok(config.nro !== null)
    assert.equal(config.nro.name, nroName)
    assert.equal(config.nro.foo, 'bar')
    assert.equal(config.nro.db, 'foo_db')
  })
})
