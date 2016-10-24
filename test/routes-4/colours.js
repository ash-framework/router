'use strict'

module.exports = class Route {
  model () {
    return { colour: 'blue' }
  }
  serialize (model) {
    model.serialized = true
    return model
  }
}
