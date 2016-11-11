module.exports = function (route) {
  return Promise.resolve()
    .then(() => {
      if (!route.deserialize) return
      return route.deserialize()
    })
    .then(() => {
      if (!route.beforeModel) return
      return route.beforeModel()
    })
    .then(() => {
      return route.model()
    })
    .then(model => {
      if (!route.afterModel) return model
      return route.afterModel(model)
    })
    .then(model => {
      if (!route.serialize) return model
      return route.serialize(model)
    })
    .catch(err => {
      let error
      if (typeof route.error === 'function') {
        error = route.error(err) || err
      }
      return Promise.reject(error)
    })
}
