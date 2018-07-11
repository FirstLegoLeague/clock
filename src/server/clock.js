
const EventEmitter = require('events')

const SECOND = 1000

exports.Clock = class extends EventEmitter {
  constructor () {
    super()

    this._countdown = 0
  }

  startCountdown (seconds) {
    this._interval = setInterval(() => {
      this._countdown -= 1
      setImmediate(() => this.emit('time', this._countdown))

      if (this._countdown <= 0) {
        setImmediate(() => this._end())
      }
    }, SECOND)

    this._countdown = seconds
    setImmediate(() => this.emit('time', this._countdown))
  }

  stopCountdown () {
    if (this._interval) {
      clearInterval(this._interval)
      delete this._interval
    }
  }

  _end () {
    this.emit('end')
    if (this._interval) {
      clearInterval(this._interval)
      delete this._interval
    }
  }
}
