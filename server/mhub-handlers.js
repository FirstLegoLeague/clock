
const Promise = require('bluebird')
const { MClient } = require('mhub')

const { logger } = require('./logger')
const { getCurrentConfig } = require('./configuration')

const mClient = new MClient(process.env.MHUB_URI)

let loginPromise = null

mClient.on('error', msg => {
  logger.error('Unable to connect to mhub, other modules won\'t be notified changes \n ' + msg)
})

mClient.on('close', () => {
  loginPromise = null
  logger.warn('Disconnected from mhub. Retrying upon next publish')
})

function login () {
  if (!loginPromise) {
    loginPromise = Promise.resolve(mClient.connect())
      .then(() => mClient.login('protected-client', process.env.PROTECTED_MHUB_PASSWORD))
      .catch(err => {
        logger.error(`error while logging into mhub: ${err.message}`)
      })
  }

  return loginPromise
}

exports.sendEvent = event => {
  return login()
    .then(() => logger.info(`sending ${event} event to mhub`))
    .then(() => mClient.publish('protected', `clock:${event}`, {}))
}

exports.sendTimeEvent = time => {
  return login()
    .then(() => logger.debug(`sending time event to mhub for (t=${time})`))
    .then(() => mClient.publish('protected', 'clock:time', Object.assign({ time }, getCurrentConfig())))
}

exports.sendClockFormat = format => {
  return login()
    .then(() => logger.debug(`sending format event to mhub for format ${format}`))
    .then(() => mClient.publish('protected', 'clock:format-changed', { format }))
}

exports.subscribe = (node, topic, listener) => {
  return login()
    .then(() => mClient.subscribe(node, topic))
    .then(() => mClient.on('message', function (message) {
      if (message.topic === topic) {
        listener.apply(this, arguments)
      }
    }))
}
