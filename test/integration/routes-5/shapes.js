'use strict'

const Ash = require('@ash-framework/classes')

module.exports = class Route extends Ash.Route {
  deserialize () {
    this.body.sides = 3
  }
  model () {
    return this.body
  }
}
