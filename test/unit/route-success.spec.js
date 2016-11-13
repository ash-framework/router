/* global describe, it, afterEach */

const td = require('testdouble')
const routeSuccess = require('../../src/route-success')

describe('route-success', function () {
  afterEach(() => {
    td.reset()
  })

  it('route success called with an object', function () {
    const json = td.function('.json')
    const status = td.function('.status')
    const model = {}
    const response = { json, status }

    routeSuccess(model, 200, response)

    td.verify(json(model))
    td.verify(status(200))
  })

  it('route success called with a string', function () {
    const send = td.function('.send')
    const status = td.function('.status')
    const model = 'Gwibble'
    const response = { send, status }

    routeSuccess(model, 200, response)

    td.verify(send(model))
    td.verify(status(200))
  })
})
