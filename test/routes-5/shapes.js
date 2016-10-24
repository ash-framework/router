'use strict'

module.exports = class Route {
  deserialize (params, query, body, httpContext) {
    body.sides = 3
  }
  model (params, query, body) {
    return body
  }
}
