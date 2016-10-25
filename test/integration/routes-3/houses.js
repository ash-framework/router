'use strict'

module.exports = class Route {
  beforeModel (params, query, body, ctx) {
    ctx.set('one', 'one')
  }
  model (params, query, body, ctx) {
    ctx.set('two', 'two')
    return { one: ctx.get('one') }
  }
  afterModel (model, params, query, body, ctx) {
    model.two = ctx.get('two')
    return model
  }
}
