
const Promise = require('bluebird')
const { MClient } = require('mhub')

const { logger } = require('./logger')

const CONFIGURATION_NODE = 'configuration'
const CONFIGURATION_TOPIC = 'config:clock'

const mClient = new MClient(process.env.MHUB_URI)

const loginPromise = Promise.resolve(mClient.connect())
  .then(() => mClient.login(CONFIGURATION_NODE, process.env.SECRET))
  .catch(err => {
    logger.error(`error while logging into mhub (configuration): ${err.message}`)
  })

let clockFormat, precount

exports.linkConfiguration = ({ mhub }) => {
  loginPromise
    .then(() => mClient.on('message', message => {
      if (message.topic === CONFIGURATION_TOPIC) {
        logger.info('Received configuration from mhub')
        const clockFormatField = message.data.clockFormatFields.find(f => f.name === 'clockFormat')
        const precountField = message.data.clockFormatFields.find(f => f.name === 'precount')
        if (clockFormatField) {
          clockFormat = clockFormatField.value
          precount = precountField.value
          mhub.sendClockFormat(clockFormatField.value)
            .catch(err => logger.error(`Error while sending clock format changed event: ${err.message}`))
        }
      }
    }))
    .then(() => mClient.subscribe(CONFIGURATION_NODE, CONFIGURATION_TOPIC))
    .catch(err => { throw err })
}

exports.getCurrentConfig = () => ({ clockFormat, precount })
