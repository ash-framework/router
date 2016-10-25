module.exports = function (Route) {
  if (!Route) return null
  const route = new Route()
  if (!route.model) {
    throw new Error(`"Model hook" for route "${Route.constructor.name}" was not found, but is required`)
  }
  return route
}
