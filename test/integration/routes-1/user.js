'use strict'

const Classes = require('@ash-framework/classes')

module.exports = class Route extends Classes.Route {
  model () {
    return this.params.user_id
  }
  afterModel (model) {
    return '12'
  }
}
