'use strict'

const Classes = require('@ash-framework/classes')

module.exports = class Route extends Classes.Route {
  model () {
    return Promise.resolve({
      name: 'bob'
    })
  }

  afterModel (model) {
    model.lastName = 'Jones'
    return model
  }
}
