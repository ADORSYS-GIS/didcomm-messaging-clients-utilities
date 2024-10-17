'use strict'

function notImplemented(topic) {
  throw new TypeError(`Not Implemented: ${topic}`)
}

module.exports = {
  notImplemented
}
