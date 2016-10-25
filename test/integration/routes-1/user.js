'use strict'

module.exports = class Route {
  model (params) {
    return params.user_id
  }
  afterModel (model) {
    return '12'
  }
}
