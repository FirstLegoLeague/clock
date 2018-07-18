
const Promise = require('bluebird')
const { MClient } = require('mhub')

const { logger } = require('./logger')

const CONFIGURATION_NODE = 'configuration'
const CONFIGURATION_TOPIC = 'config:clock'

const mClient = new MClient('ws://localhost:13900')

const loginPromise = Promise.resolve(mClient.connect())
  .then(() => mClient.login(CONFIGURATION_NODE, process.env.SECRET))
  .catch(err => {
    logger.error(`error while logging into mhub (configuration): ${err.message}`)
  })

let clockFormat

exports.linkConfiguration = ({ mhub }) => {
  loginPromise
    .then(() => mClient.on('message', message => {
      if (message.topic === CONFIGURATION_TOPIC) {
        logger.info('Received configurations from mhub')
        const field = message.data.fields.find(f => f.name === 'clockFormat')
        if (field) {
          clockFormat = field.value
          mhub.sendClockFormat(field.value)
            .catch(err => logger.error(`Error while sending clock format changed event: ${err.message}`))
        }
      }
    }))
    .then(() => mClient.subscribe(CONFIGURATION_NODE, CONFIGURATION_TOPIC))
    .catch(err => { throw err })
}

exports.getCurrentConfig = () => ({ clockFormat })
