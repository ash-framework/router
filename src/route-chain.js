module.exports = function (route, httpContext) {
  const {request} = httpContext
  return Promise.resolve()
    .then(() => {
      if (!route.deserialize) return
      return route.deserialize(request.params, request.query, request.body, httpContext)
    })
    .then(() => {
      if (!route.beforeModel) return
      return route.beforeModel(request.params, request.query, request.body, httpContext)
    })
    .then(() => {
      return route.model(request.params, request.query, request.body, httpContext)
    })
    .then(model => {
      if (!route.afterModel) return model
      return route.afterModel(model, request.params, request.query, request.body, httpContext)
    })
    .then(model => {
      if (!route.serialize) return model
      return route.serialize(model, request.params, request.query, request.body, httpContext)
    })
    .catch(err => {
      if (!route.error) {
        return Promise.reject(err)
      }
      return route.error(err, httpContext)
        .then(err => {
          return Promise.reject(err)
        })
    })
}
