const HttpContext = require('@ash-framework/http-context')
const routeChain = require('./route-chain')
const routeError = require('./route-error')
const routeSuccess = require('./route-success')

module.exports = function (route) {
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
