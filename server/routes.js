
const { Router } = require('express')

const { logger } = require('./logger')
const { WRONG_STATE_OF_CLOCK_CODE } = require('./manager')

exports.createRouter = ({ clockManager, clock, sounds, configuration }) => {
  const router = new Router()

  router.get('/startup', (req, res) => {
    res.json({
      status: clockManager.status,
      time: clock.time,
      clockFormat: configuration.getCurrentConfig().clockFormat
    })
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

  router.post('/sound/start', (req, res) => {
    sounds.playStartSound()
      .then(() => res.send())
      .catch(e => {
        logger.error(e)
        res.status(500).send()
      })
  })

  router.post('/sound/end', (req, res) => {
    sounds.playEndSound()
      .then(() => res.send())
      .catch(e => {
        logger.error(e)
        res.status(500).send()
      })
  })

  router.post('/sound/stop', (req, res) => {
    sounds.playStopSound()
      .then(() => res.send())
      .catch(e => {
        logger.error(e)
        res.status(500).send()
      })
  })

  router.post('/sound/endgame', (req, res) => {
    sounds.playEndGameSound()
      .then(() => res.send())
      .catch(e => {
        logger.error(e)
        res.status(500).send()
      })
  })

  return router
}
