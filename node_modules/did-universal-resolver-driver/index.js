'use strict'

const { Driver } = require('./driver')

function createDriver(opts) {
  return new Driver(opts)
}

module.exports = Object.assign(createDriver, { Driver })
