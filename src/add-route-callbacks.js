const createCallback = require('./create-callback')
const loadFile = require('./load-file')
const instantiateRouteClass = require('./instantiate-route-class')
const path = require('path')

function addRouteCallbacks (routeObjects, routesDir) {
  return routeObjects.map(routeObj => {
    if (routeObj.children.length > 0) {
      routeObj.children = addRouteCallbacks(routeObj.children, path.join(routesDir, routeObj.name))
    } else {
      const Route = loadFile(routeObj.name, routesDir)
      const route = instantiateRouteClass(Route)
      if (!route) return
      routeObj.callback = createCallback(route)
    }
    return routeObj
  })
  .filter(route => route)
}

module.exports = addRouteCallbacks
