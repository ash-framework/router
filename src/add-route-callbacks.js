const createCallback = require('./create-callback')
const loadFile = require('./load-file')
const path = require('path')
const fileExists = require('./file-exists')

function addRouteCallbacks (routeObjects, routesDir) {
  const objects = []
  routeObjects.forEach(routeObj => {
    if (routeObj.children.length > 0) {
      // implicit routes
      const allowedMethods = ['get', 'put', 'post', 'patch', 'delete', 'options', 'head']
      allowedMethods.forEach(method => {
        let Route
        if (method.toLowerCase() === 'get') {
          if (fileExists(`${routeObj.name}/index.js`, routesDir)) {
            Route = loadFile(`${routeObj.name}/index.js`, routesDir)
          } else if (fileExists(`${routeObj.name}/index.get.js`, routesDir)) {
            Route = loadFile(`${routeObj.name}/index.get.js`, routesDir)
          }
        }
        if (!Route && fileExists(`${routeObj.name}/index.${method}.js`, routesDir)) {
          Route = loadFile(`${routeObj.name}/index.${method}.js`, routesDir)
        }
        if (Route) {
          objects.push({
            method: method,
            callback: createCallback(Route),
            name: 'index',
            path: routeObj.path
          })
        }
      })

      // recurse

      objects.push({
        path: routeObj.path,
        children: addRouteCallbacks(routeObj.children, path.join(routesDir, routeObj.name))
      })
    } else {
      // explicit routes
      let Route

      if (fileExists(`${routeObj.name}.js`, routesDir)) {
        Route = loadFile(`${routeObj.name}.js`, routesDir)
        if (Route) {
          objects.push({
            method: 'get',
            callback: createCallback(Route),
            name: routeObj.name,
            path: routeObj.path
          })
        }
      } else if (fileExists(`${routeObj.name}.get.js`, routesDir)) {
        Route = loadFile(`${routeObj.name}.get.js`, routesDir)
        if (Route) {
          objects.push({
            method: 'get',
            callback: createCallback(Route),
            name: routeObj.name,
            path: routeObj.path
          })
        }
      }

      if (fileExists(`${routeObj.name}.post.js`, routesDir)) {
        Route = loadFile(`${routeObj.name}.post.js`, routesDir)
        if (Route) {
          objects.push({
            method: 'post',
            callback: createCallback(Route),
            name: routeObj.name,
            path: routeObj.path
          })
        }
      }

      if (fileExists(`${routeObj.name}.patch.js`, routesDir)) {
        Route = loadFile(`${routeObj.name}.patch.js`, routesDir)
        if (Route) {
          objects.push({
            method: 'patch',
            callback: createCallback(Route),
            name: routeObj.name,
            path: routeObj.path
          })
        }
      }

      if (fileExists(`${routeObj.name}.put.js`, routesDir)) {
        Route = loadFile(`${routeObj.name}.put.js`, routesDir)
        if (Route) {
          objects.push({
            method: 'put',
            callback: createCallback(Route),
            name: routeObj.name,
            path: routeObj.path
          })
        }
      }

      if (fileExists(`${routeObj.name}.delete.js`, routesDir)) {
        Route = loadFile(`${routeObj.name}.delete.js`, routesDir)
        if (Route) {
          objects.push({
            method: 'delete',
            callback: createCallback(Route),
            name: routeObj.name,
            path: routeObj.path
          })
        }
      }
    }
  })
  return objects
}

module.exports = addRouteCallbacks
