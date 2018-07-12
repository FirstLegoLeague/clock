
const Promise = require('bluebird')
const { MClient } = require('mhub')

const { logger } = require('./logger')

const mclient = new MClient(process.env.MHUB_CONNECTION_STRING)

const loginPromise = Promise.resolve(mclient.connect())
  .then(() => mclient.login('protected-client', process.env.MHUB_PASSWORD))
  .catch(err => {
    logger.error(`error while logging into mhub: ${err.message}`)
  })

exports.sendEvent = event => {
  return loginPromise
    .then(() => logger.info(`sending ${event} event to mhub`))
    .then(() => mclient.publish('protected', `clock:${event}`, {}))
    .catch(err => {
      logger.error(`error while sending event to mhub: ${err.message}`)
    })
}

exports.sendTimeEvent = time => {
  return loginPromise
    .then(() => logger.debug(`sending time event to mhub for (t=${time})`))
    .then(() => mclient.publish('protected', 'clock:time', { time }))
    .catch(err => {
      logger.error(`error while sending time event to mhub: ${err.message}`)
    })
}
