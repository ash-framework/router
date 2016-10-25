'use strict'

module.exports = class Route {
  model (params) {
    return {name: 'fluffy', id: params.cat_id}
  }
}
