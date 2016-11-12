module.exports = function (route) {
  return Promise.resolve()
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
      route.currentModel = model
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
