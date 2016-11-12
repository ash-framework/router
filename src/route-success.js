const isReadableStream = require('./is-stream')

module.exports = function (model, httpContext) {
  const {response} = httpContext
  if (isReadableStream(model)) {
    model.pipe(response)
  } else if (typeof model === 'object') {
    return response.json(model)
  } else if (!model) {
    response.send(String())
  } else {
    response.send(String(model))
  }
}
