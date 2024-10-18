'use strict'

const { notImplemented } = require('./util')
const { EventEmitter } = require('events')

class Driver extends EventEmitter {
  constructor(opts) {
    super()
    this.setMaxListeners(0)

    if (!opts || 'object' != typeof opts) {
      opts = {}
    }

    if ('function' == typeof opts.resolve) {
      this.resolve = opts.resolve
    }

    if ('function' == typeof opts.properties) {
      this.properties = opts.properties
    }
  }

  resolve(identifier) { notImplemented("Driver.resolve(identifier)") }
  properties() { notImplemented("Driver.properties()") }
}

module.exports = {
  Driver
}
