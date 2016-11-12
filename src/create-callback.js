const HttpContext = require('@ash-framework/http-context')
const routeChain = require('./route-chain')
const routeSuccess = require('./route-success')

module.exports = function (Route) {
  return function (req, res, next) {
    const httpContext = new HttpContext(req, res)
    const route = new Route(httpContext)
    routeChain(route)
      .then(model => {
        const response = httpContext.response
        const status = route.status || response.status || 200
        routeSuccess(model, status, response)
      })
      .catch(next)
  }
}
