
import { MClient } from 'mhub/dist/src/browserclient'
import Promise from 'bluebird'

const RETRY_TIMEOUT = 1000 // 1 second

const mClient = new MClient(`ws://${window.location.hostname}:13900`)

const listeners = {}

let connectPromise = null

function attemptRecconection () {
  connectPromise = null
  console.log('Disonnected from mhub')
  setTimeout(() => {
    console.log('Retrying mhub connection')
    connectPromise = null
    connect()
      .catch(() => {
        attemptRecconection()
      })
  }, RETRY_TIMEOUT)
}

mClient.on('close', () => {
  attemptRecconection()
})

mClient.on('message', message => {
  const topic = message.topic

  listeners[topic].forEach(listener => listener(message.data))
})

function connect () {
  if (!connectPromise) {
    connectPromise = Promise.resolve(mClient.connect())
      .then(() => {
        console.log('Connected to mhub')
        Object.keys(listeners).map(topic => mClient.subscribe('protected', topic))
      })
      .catch(err => {
        console.error(`Error while logging into mhub: ${err.message}`)
        throw err
      })
  }

  return connectPromise
}

function removeListener (event, listener) {
  const topic = `clock:${event}`
  const index = listeners[topic].indexOf(listener)
  listeners[topic].splice(index, 1)
}

function onEvent (event, listener) {
  const topic = `clock:${event}`
  listeners[topic] = listeners[topic] || []

  return connect()
    .then(() => mClient.subscribe('protected', topic))
    .then(() => { listeners[topic].push(listener) })
    .then(() => removeListener.bind(null, event, listener))
}

export const onEndEvent = onEvent.bind(null, 'end')
export const onStopEvent = onEvent.bind(null, 'stop')
export const onTimeEvent = onEvent.bind(null, 'time')
export const onStartEvent = onEvent.bind(null, 'start')
export const onReloadEvent = onEvent.bind(null, 'reload')
export const onFormatChangedEvent = onEvent.bind(null, 'format-changed')
