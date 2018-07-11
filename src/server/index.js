
const express = require('express')

const mhub = require('./mhub-handlers')
const { Clock } = require('./clock')
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

app.use(express.static('dist'))

app.use('/api', createRouter(clockManager))

app.listen(8080, () => console.log('Listening on port 8080!'))
