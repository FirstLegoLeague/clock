const Promise = require('bluebird')
const sinon = require('sinon')

exports.env = (environment, func) => {
  const originalEnv = Object.assign({}, process.env)
  Object.assign(process.env, environment)

  return Promise.try(() => func())
    .finally(() => {
      process.env = originalEnv
    })
}

exports.stringContaining = substring => {
  return sinon.match(value => {
    return typeof value === 'string' && value.includes(substring)
  }, `a string containing "${substring}"`)
}
