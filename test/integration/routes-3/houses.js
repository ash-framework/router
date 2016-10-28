'use strict'

const Classes = require('@ash-framework/classes')

module.exports = class Route extends Classes.Route {
  beforeModel () {
    this.httpContext.set('one', 'one')
  }
  model () {
    this.httpContext.set('two', 'two')
    return { one: this.httpContext.get('one') }
  }
  afterModel (model) {
    model.two = this.httpContext.get('two')
    return model
  }
}
