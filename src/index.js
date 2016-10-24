'use strict'

const path = require('path')
const parseRouteObjects = require('ember-route-objects')
const createExpressRouter = require('express-object-defined-routes')
const HttpContext = require('@ash-framework/http-context')
const routeChain = require('./route-chain')
const routeError = require('./route-error')
const routeSuccess = require('./route-success')
const ArgumentError = require('@ash-framework/argument-error')
const FileNotFoundError = require('@ash-framework/file-not-found-error')

function createCallback (route) {
  return function (req, res) {
    const httpContext = new HttpContext(req, res)
    routeChain(route, httpContext)
      .then(model => {
        routeSuccess(model, httpContext)
      })
      .catch(err => {
        routeError(err, httpContext)
      })
  }
}

function addRouteCallbacks (routeObjects, routesDir) {
  return routeObjects.map(routeObj => {
    if (routeObj.children.length > 0) {
      routeObj.children = addRouteCallbacks(routeObj.children, path.join(routesDir, routeObj.name))
    } else {
      let Route
      const routeFilePath = path.join(routesDir, routeObj.name)
      try {
        Route = require(routeFilePath)
        const route = new Route()
        if (!route.model) {
          throw new Error(`"Model hook" for route "${routeFilePath}" was not found, but is required`)
        }
        routeObj.callback = createCallback(route)
      } catch (err) {
        if (routeObj.name !== 'index') {
          throw new FileNotFoundError(`${routeObj.name}.js`, routesDir)
        }
        return
      }
    }
    return routeObj
  })
  .filter(route => route)
}

module.exports = function (definition, options) {
  if (typeof definition !== 'function') {
    throw new ArgumentError('Router', 'definition', `Expected "definition" to be a function but "${typeof definition}" was given`)
  }
  if (typeof options !== 'object') {
    throw new ArgumentError('Router', 'options', `Expected "options" to be an object but "${typeof options}" was given`)
  }
  if (typeof options.routesDir !== 'string') {
    throw new ArgumentError('Router', 'options.routesDir', `Expected "options.routesDir" to be a string but "${typeof options.routesDir}" was given`)
  }

  // parse ember style route definitions into an object structure
  let routeObjects = parseRouteObjects(definition)
  routeObjects = addRouteCallbacks(routeObjects, options.routesDir)

  // return an express router that can be mounted using expresses app.use
  return createExpressRouter(routeObjects)
}
