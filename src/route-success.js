module.exports = function (model, httpContext) {
  const {response} = httpContext
  if (typeof model === 'object') {
    return response.json(model)
  }
  response.send(model)
}
