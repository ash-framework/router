const HttpContext = require('@ash-framework/http-context')
const routeChain = require('./route-chain')
const routeError = require('./route-error')
const routeSuccess = require('./route-success')

module.exports = function (Route) {
  return function (req, res) {
    const httpContext = new HttpContext(req, res)
    const route = new Route(httpContext)
    routeChain(route)
      .then(model => {
        routeSuccess(model, httpContext)
      })
      .catch(err => {
        routeError(err, httpContext)
      })
  }
}
