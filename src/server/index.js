
const express = require('express')
const { correlationMiddleware } = require('@first-lego-league/ms-correlation')
const { authenticationMiddleware, authenticationDevMiddleware } = require('@first-lego-league/ms-auth')
const { loggerMiddleware } = require('@first-lego-league/ms-logger')

const mhub = require('./mhub-handlers')
const sounds = require('./sounds')
const { Clock } = require('./clock')
const { logger } = require('./logger')
const { ClockManager } = require('./manager')
const { createRouter } = require('./routes')
const { linkEvents } = require('./events-linker')

const clock = new Clock()
const clockManager = new ClockManager(clock)

linkEvents({ clockManager, clock, sounds, mhub })

const app = express()

app.use(correlationMiddleware)
app.use(loggerMiddleware)
if (process.env.NODE_ENV === 'development') {
  app.use(authenticationDevMiddleware('roy'))
} else {
  app.use(authenticationMiddleware)
}
app.use(express.static('public'))

app.use('/api', createRouter({ clockManager, clock, sounds }))

app.listen(process.env.PORT, () => logger.info(`Listening on port ${process.env.PORT}!`))
