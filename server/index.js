const express = require('express')
const { correlationMiddleware } = require('@first-lego-league/ms-correlation')
const { authenticationMiddleware, authenticationDevMiddleware } = require('@first-lego-league/ms-auth')
const { loggerMiddleware } = require('@first-lego-league/ms-logger')

const mhub = require('./mhub-handlers')
const sounds = require('./sounds')
const configuration = require('./configuration')
const { Clock } = require('./clock')
const { TimeSaver } = require('./time-saver')
const { logger } = require('./logger')
const { ClockManager } = require('./manager')
const { createRouter } = require('./routes')
const { linkEvents } = require('./events-linker')

const clock = new Clock()
const timeSaver = new TimeSaver()
const clockManager = new ClockManager(clock, timeSaver)

configuration.linkConfiguration({ mhub })

linkEvents({ clockManager, clock, sounds, mhub })

const app = express()

app.use(correlationMiddleware)
app.use(loggerMiddleware)

if (process.env.NODE_ENV === 'development') {
  app.use(authenticationDevMiddleware('scorekeeper'))
} else {
  app.use(authenticationMiddleware)
}

app.use(express.static('public'))

app.use('/api', createRouter({ clockManager, clock, sounds, configuration }))

app.listen(process.env.PORT, () => logger.info(`Listening on port ${process.env.PORT}!`))

process.on('SIGINT', () => {
  logger.info('Process received SIGINT: shutting down')
  process.exit(1)
})
