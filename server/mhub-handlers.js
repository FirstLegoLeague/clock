
const Promise = require('bluebird')
const { MClient } = require('mhub')

const { logger } = require('./logger')

const mClient = new MClient(process.env.MHUB_URI)

const loginPromise = Promise.resolve(mClient.connect())
  .then(() => mClient.login('protected-client', process.env.PROTECTED_MHUB_PASSWORD))
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

exports.sendClockFormat = format => {
  return loginPromise
    .then(() => logger.debug(`sending format event to mhub for format ${format}`))
    .then(() => mClient.publish('protected', 'clock:format-changed', { format }))
}

exports.subscribe = (node, topic, listener) => {
  return loginPromise
    .then(() => mClient.subscribe(node, topic))
    .then(() => mClient.on('message', function (message) {
      if (message.topic === topic) {
        listener.apply(this, arguments)
      }
    }))
}
