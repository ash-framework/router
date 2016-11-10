'use strict'

const Ash = require('@ash-framework/classes')

module.exports = class Route extends Ash.Route {
  model () {
    return {method: 'put', name: 'widget', id: this.params.widget_id}
  }
}
