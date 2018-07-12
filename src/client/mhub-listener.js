
import { MClient } from 'mhub/dist/src/browserclient'
import Promise from 'bluebird'

const mClient = new MClient('ws://localhost:13900')

const listeners = {}

const connectPromise = Promise.resolve(mClient.connect())
  .then(() => {
    mClient.on('message', message => {
      const topic = message.topic

      listeners[topic].forEach(listener => listener(message.data))
    })
  })
  .catch(err => {
    console.error(`error while logging into mhub: ${err.message}`)
  })

function removeListener (event, listener) {
  const topic = `clock:${event}`
  const index = listeners[topic].indexOf(listener)
  listeners[topic].splice(index, 1)
}

function onEvent (event, listener) {
  const topic = `clock:${event}`
  listeners[topic] = listeners[topic] || []

  return connectPromise
    .then(() => mClient.subscribe('protected', topic))
    .then(() => { listeners[topic].push(listener) })
    .then(() => removeListener.bind(null, event, listener))
}

export const onEndEvent = onEvent.bind(null, 'end')
export const onStopEvent = onEvent.bind(null, 'stop')
export const onTimeEvent = onEvent.bind(null, 'time')
export const onStartEvent = onEvent.bind(null, 'start')
export const onReloadEvent = onEvent.bind(null, 'reload')
