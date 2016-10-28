'use strict'

const Classes = require('@ash-framework/classes')

module.exports = class Route extends Classes.Route {
  model () {
    return {name: 'fluffy', id: this.params.cat_id}
  }
}
