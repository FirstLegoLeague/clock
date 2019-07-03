const express = require('express')
const { correlationMiddleware } = require('@first-lego-league/ms-correlation')
const { authenticationMiddleware, authenticationDevMiddleware } = require('@first-lego-league/ms-auth')
const { loggerMiddleware } = require('@first-lego-league/ms-logger')

const mhub = require('./mhub-handlers')
const configuration = require('./configuration')
const { Clock } = require('./clock')
const { TimeSaver } = require('./time-saver')
const { logger } = require('./logger')
const { ClockManager } = require('./manager')
const { createRouter } = require('./routes')
const { linkEvents } = require('./events-linker')

const { version: projectVersion } = require('../package.json')

const clock = new Clock()
const timeSaver = new TimeSaver()
const clockManager = new ClockManager(clock, timeSaver, configuration)

logger.info(`-------------------- clock version ${projectVersion} startup --------------------`)

configuration.linkConfiguration({ mhub })

linkEvents({ clockManager, clock, mhub })

const app = express()

app.use(correlationMiddleware)
app.use(loggerMiddleware)

if (process.env.NODE_ENV === 'development') {
  app.use(authenticationDevMiddleware('scorekeeper'))
} else {
  app.use(authenticationMiddleware)
}

app.use(express.static('public'))

app.use('/api', createRouter({ clockManager, clock, configuration }))

app.listen(process.env.PORT, () => logger.info(`Listening on port ${process.env.PORT}!`))

process.on('SIGINT', () => {
  logger.info('Process received SIGINT: shutting down')
  timeSaver.clearTime()
  process.exit(130)
})

process.on('uncaughtException', err => {
  logger.fatal(err.message)
  process.exit(1)
})

process.on('unhandledRejection', err => {
  logger.fatal(err.message)
  process.exit(1)
})
