
const EventEmitter = require('events')

const SECOND = 1000

function exactTimeListener (listener, requestedTime, currentTime) {
  if (currentTime === requestedTime) {
    listener.call(this, currentTime)
  }
}

exports.Clock = class extends EventEmitter {
  constructor () {
    super()

    this._time = 0
  }

  get time () {
    return this._time
  }

  set time (seconds) {
    this._time = seconds
    setImmediate(() => this.emit('time', this._time))
  }

  onExactTime (requestedTime, listener) {
    this.on('time', exactTimeListener.bind(this, listener, requestedTime))
  }

  setTime (seconds) {
    this.time = seconds
  }

  startCountdown (seconds) {
    this._interval = setInterval(() => {
      this._time -= 1
      setImmediate(() => this.emit('time', this._time))

      if (this._time <= 0) {
        setImmediate(() => this._endCountdown())
      }
    }, SECOND)

    this._time = seconds
    setImmediate(() => this.emit('time', this._time))
  }

  stopCountdown () {
    if (this._interval) {
      clearInterval(this._interval)
      delete this._interval
    }
  }

  _endCountdown () {
    this.emit('end')
    if (this._interval) {
      clearInterval(this._interval)
      delete this._interval
    }
  }
}
