const path = require('path')
const FileNotFoundError = require('@ash-framework/file-not-found-error')

module.exports = function (name, directory) {
  const filePath = path.join(directory, name)
  try {
    return require(filePath)
  } catch (err) {
    if (name !== 'index') {
      throw new FileNotFoundError(name, directory)
    }
  }
}
