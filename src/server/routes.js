
const { Router } = require('express')

const { WRONG_STATE_OF_CLOCK_CODE } = require('./manager')

exports.createRouter = clockManager => {
  const router = new Router()

  router.get('/state', (req, res) => {
    res.json({ state: clockManager.state })
  })

  router.post('/action/start', (req, res) => {
    try {
      clockManager.start()
      res.send()
    } catch (e) {
      if (e.code === WRONG_STATE_OF_CLOCK_CODE) {
        res.status(400).send({
          message: e.message,
          code: e.code
        })
      } else {
        console.log(e)
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
        console.log(e)
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
        res.status(400).send({
          message: e.message,
          code: e.code
        })
      } else {
        console.log(e)
        res.status(500).send()
      }
    }
  })

  return router
}
