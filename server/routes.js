
const { Router } = require('express')

const { logger } = require('./logger')
const { WRONG_STATE_OF_CLOCK_CODE } = require('./manager')

exports.createRouter = ({ clockManager, clock, configuration }) => {
  const router = new Router()

  router.get('/startup', (req, res) => {
    res.json({
      status: clockManager.status,
      time: clock.time,
      clockFormat: configuration.getCurrentConfig().clockFormat,
      countdownEnabled: Boolean(configuration.getCurrentConfig().precount)
    })
  })

  router.post('/action/prestart', (req, res) => {
    try {
      clockManager.prestart()
      res.send()
    } catch (e) {
      if (e.code === WRONG_STATE_OF_CLOCK_CODE) {
        res.status(400).json({
          message: e.message,
          code: e.code
        })
      } else {
        logger.error(e)
        res.status(500).send()
      }
    }
  })

  router.post('/action/start', (req, res) => {
    try {
      clockManager.start()
      res.send()
    } catch (e) {
      if (e.code === WRONG_STATE_OF_CLOCK_CODE) {
        res.status(400).json({
          message: e.message,
          code: e.code
        })
      } else {
        logger.error(e)
        res.status(500).send()
      }
    }
  })

  router.post('/action/stop', (req, res) => {
    try {
      clockManager.stop()
      res.send()
    } catch (e) {
      if (e.code === WRONG_STATE_OF_CLOCK_CODE) {
        res.status(400).json({
          message: e.message,
          code: e.code
        })
      } else {
        logger.error(e)
        res.status(500).send()
      }
    }
  })

  router.post('/action/reload', (req, res) => {
    try {
      clockManager.reload()
      res.send()
    } catch (e) {
      if (e.code === WRONG_STATE_OF_CLOCK_CODE) {
        res.status(400).json({
          message: e.message,
          code: e.code
        })
      } else {
        logger.error(e)
        res.status(500).send()
      }
    }
  })

  return router
}
