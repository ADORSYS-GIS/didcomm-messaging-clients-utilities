const { Driver } = require('./')
const test = require('tape')

test("Driver#resolve should be a function", (t) => {
  const driver = new Driver()
  t.true('function' == typeof Driver.prototype.resolve)
  t.true('function' == typeof driver.resolve)
  t.end()
})

test("Not implemented Driver#resolve throws TypeError", (t) => {
  const driver = new Driver()
    t.throws(() => driver.resolve('did:test:1234'),
      TypeError, "Not implemented Driver#resolve() throws error")
  t.end()
})

test("Driver#resolve should configurable via constructor", (t) => {
  const driver = new Driver({resolve})
  function resolve() { }
  t.true(resolve == driver.resolve)
  t.end()
})

test("Driver#properties should be a function", (t) => {
  const driver = new Driver()
  t.true('function' == typeof Driver.prototype.properties)
  t.true('function' == typeof driver.properties)
  t.end()
})

test("Not implemented Driver#properties throws TypeError", (t) => {
  const driver = new Driver()
    t.throws(() => driver.properties(),
      TypeError, "Not implemented Driver#properties() throws error")
  t.end()
})

test("Driver#properties should configurable via constructor", (t) => {
  const driver = new Driver({properties})
  function properties() { }
  t.true(properties == driver.properties)
  t.end()
})
