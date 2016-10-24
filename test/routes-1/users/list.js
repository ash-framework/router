'use strict'

module.exports = class Route {
  model (params) {
    return Promise.resolve({
      name: 'bob'
    })
  }

  afterModel (model) {
    model.lastName = 'Jones'
    return model
  }
}
