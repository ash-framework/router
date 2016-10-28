'use strict'

const Classes = require('@ash-framework/classes')

module.exports = class Route extends Classes.Route {
  model () {
    return { colour: 'blue' }
  }
  serialize (model) {
    model.serialized = true
    return model
  }
}
