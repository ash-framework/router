const isReadableStream = require('./is-stream')

module.exports = function (model, status, response) {
  if (isReadableStream(model)) {
    model.status(status).pipe(response)
  } else if (typeof model === 'object') {
    return response.status(status).json(model)
  } else if (!model) {
    response.status(status).send(String())
  } else {
    response.status(status).send(String(model))
  }
}
