const HttpContext = require('@ash-framework/http-context')
const routeChain = require('./route-chain')
const routeSuccess = require('./route-success')

module.exports = function (Route, routeName) {
  return function (req, res, next) {
    const httpContext = new HttpContext(req, res)
    const route = new Route(httpContext)
    route.routeName = routeName
    routeChain(route)
      .then(model => {
        const response = httpContext.response
        let status = 200
        if (!model) {
          status = 204
        }
        if (route.method === 'post') {
          status = 201
        }
        if (response.statusCode) {
          status = response.statusCode
        }
        routeSuccess(model, status, response)
      })
      .catch(next)
  }
}
