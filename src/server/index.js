
const express = require('express')
const { correlationMiddleware } = require('@first-lego-league/ms-correlation')
const { authenticationMiddleware, authenticationDevMiddleware } = require('@first-lego-league/ms-auth')
const { loggerMiddleware } = require('@first-lego-league/ms-logger')

const mhub = require('./mhub-handlers')
const { Clock } = require('./clock')
const { logger } = require('./logger')
const { ClockManager } = require('./manager')
const { createRouter } = require('./routes')

const clock = new Clock()
const clockManager = new ClockManager(clock)

clock.on('time', time => mhub.sendTimeEvent(time))

clockManager.on('start', () => mhub.sendEvent('start'))
clockManager.on('end', () => mhub.sendEvent('end'))
clockManager.on('stop', () => mhub.sendEvent('stop'))
clockManager.on('reload', () => mhub.sendEvent('reload'))

const app = express()

app.use(correlationMiddleware)
app.use(loggerMiddleware)
if (process.env.NODE_ENV === 'development') {
  app.use(authenticationDevMiddleware('roy'))
} else {
  app.use(authenticationMiddleware)
}
app.use(express.static('dist'))

app.use('/api', createRouter(clockManager))

app.listen(process.env.PORT, () => logger.info(`Listening on port ${process.env.PORT}!`))
