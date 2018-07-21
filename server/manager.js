
const ARMED = 'armed'
const RUNNING = 'running'
const ENDED = 'ended'

const EventEmitter = require('events')

const WRONG_STATE_OF_CLOCK_CODE = exports.WRONG_STATE_OF_CLOCK_CODE = 'WRONG_STATE_OF_CLOCK'

const MATCH_TIME = (process.env.NODE_ENV === 'development') ? 30 : 150

exports.ClockManager = class extends EventEmitter {
  constructor (clock) {
    super()
    this._status = ARMED
    this._clock = clock

    this._clock.on('end', () => {
      this._end()
    })

    setImmediate(() => this.reload())
  }

  get status () {
    return this._status
  }

  start () {
    if (this._status !== ARMED) {
      throw Object.assign(new Error('Clock is not armed'), {
        code: WRONG_STATE_OF_CLOCK_CODE
      })
    }

    this._status = RUNNING
    this.emit('start')
    this._clock.startCountdown(MATCH_TIME)
  }

  _end () {
    if (this._status !== RUNNING) {
      throw Object.assign(new Error('Clock is not running when countdown ended'), {
        code: WRONG_STATE_OF_CLOCK_CODE
      })
    }

    this._status = ENDED
    this.emit('end')
  }

  stop () {
    if (this._status !== RUNNING) {
      throw Object.assign(new Error('Clock is not running'), {
        code: WRONG_STATE_OF_CLOCK_CODE
      })
    }

    this._status = ARMED
    this._clock.stopCountdown()
    this._clock.setTime(MATCH_TIME)
    this.emit('stop')
  }

  reload () {
    if (![ARMED, ENDED].includes(this._status)) {
      throw Object.assign(new Error('Clock is not ended'), {
        code: WRONG_STATE_OF_CLOCK_CODE
      })
    }

    this._status = ARMED
    this._clock.setTime(MATCH_TIME)
    this.emit('reload')
  }
}
