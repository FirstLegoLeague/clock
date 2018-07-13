
const Promise = require('bluebird')
const { MClient } = require('mhub')

const { logger } = require('./logger')

const mClient = new MClient(process.env.MHUB_CONNECTION_STRING)

const loginPromise = Promise.resolve(mClient.connect())
  .then(() => mClient.login('protected-client', process.env.MHUB_PASSWORD))
  .catch(err => {
    logger.error(`error while logging into mhub: ${err.message}`)
  })

exports.sendEvent = event => {
  return loginPromise
    .then(() => logger.info(`sending ${event} event to mhub`))
    .then(() => mClient.publish('protected', `clock:${event}`, {}))
}

exports.sendTimeEvent = time => {
  return loginPromise
    .then(() => logger.debug(`sending time event to mhub for (t=${time})`))
    .then(() => mClient.publish('protected', 'clock:time', { time }))
}
