const path = require('path')
const HttpContext = require('@ash-framework/http-context')

module.exports = function (route) {
  function applyMiddleware (middlewareList) {
    if (middlewareList.length < 1) return
    const middlewareName = middlewareList.shift()
    const Middleware = require(path.join(process.cwd(), 'app', 'middleware') + '/' + middlewareName)
    const {request, response} = route
    const middleware = new Middleware(new HttpContext(request, response))
    return Promise.resolve()
      .then(() => middleware.register())
      .then(() => applyMiddleware(middlewareList))
  }

  return Promise.resolve()
    .then(() => {
      if (route.hasMiddleware) {
        return applyMiddleware(route.registeredMiddleware)
      }
    })
    .then(() => {
      if (route.deserialize) {
        return route.deserialize()
      }
    })
    .then(() => {
      if (route.beforeModel) {
        return route.beforeModel()
      }
    })
    .then(() => {
      return route.model()
    })
    .then(model => {
      const promises = [model]
      if (route.afterModel) {
        promises.push(route.afterModel(model))
      }
      return Promise.all(promises)
    })
    .then(model => {
      const promises = [model[0]]
      if (route.serialize) {
        promises.push(route.serialize(model[0]))
      }
      return Promise.all(promises)
    })
    .then(model => {
      return model[0]
    })
    .catch(err => {
      let error = err
      if (typeof route.error === 'function') {
        error = route.error(err)
      }
      if (error) {
        return Promise.reject(error)
      } else {
        return route.currentModel
      }
    })
}
