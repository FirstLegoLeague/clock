
const { logger } = require('./logger')

function catchPromiseWrap (asyncFunction, operationDescription, ...args) {
  asyncFunction(...args)
    .catch(err => {
      logger.error(`Error while ${operationDescription}: ${err.message}`)
    })
}

exports.linkEvents = ({ clockManager, clock, mhub, sounds }) => {
  const mhubSendPrestartEvent = mhub.sendEvent.bind(null, 'prestart')
  const mhubSendStartEvent = mhub.sendEvent.bind(null, 'start')
  const mhubSendEndEvent = mhub.sendEvent.bind(null, 'end')
  const mhubSendStopEvent = mhub.sendEvent.bind(null, 'stop')
  const mhubSendReloadEvent = mhub.sendEvent.bind(null, 'reload')

  clock.on('time', catchPromiseWrap.bind(null, mhub.sendTimeEvent, 'sending time event to mhub'))

  clockManager.on('prestart', catchPromiseWrap.bind(null, mhubSendPrestartEvent, 'sending prestart event to mhub'))
  clockManager.on('start', catchPromiseWrap.bind(null, mhubSendStartEvent, 'sending start event to mhub'))
  clockManager.on('end', catchPromiseWrap.bind(null, mhubSendEndEvent, 'sending end event to mhub'))
  clockManager.on('stop', catchPromiseWrap.bind(null, mhubSendStopEvent, 'sending stop event to mhub'))
  clockManager.on('reload', catchPromiseWrap.bind(null, mhubSendReloadEvent, 'sending reload event to mhub'))

  clockManager.on('start', catchPromiseWrap.bind(null, sounds.playStartSound, 'playing start sound'))
  clockManager.on('stop', catchPromiseWrap.bind(null, sounds.playStopSound, 'playing stop sound'))
  clockManager.on('end', catchPromiseWrap.bind(null, sounds.playEndSound, 'playing end sound'))
  clock.onExactTime(30, catchPromiseWrap.bind(null, sounds.playEndGameSound, 'playing end-game sound'))
}
