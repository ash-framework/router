const createCallback = require('./create-callback')
const loadFile = require('./load-file')
const path = require('path')

function addRouteCallbacks (routeObjects, routesDir) {
  return routeObjects.map(routeObj => {
    if (routeObj.children.length > 0) {
      routeObj.children = addRouteCallbacks(routeObj.children, path.join(routesDir, routeObj.name))
    } else {
      const Route = loadFile(routeObj.name, routesDir)
      if (!Route) return
      routeObj.callback = createCallback(Route)
    }
    return routeObj
  })
  .filter(route => route)
}

module.exports = addRouteCallbacks
