
const ARMED = 'armed'
const RUNNING = 'running'
const ENDED = 'ended'

const EventEmitter = require('events')

const WRONG_STATE_OF_CLOCK_CODE = exports.WRONG_STATE_OF_CLOCK_CODE = 'WRONG_STATE_OF_CLOCK'

const MATCH_TIME = 30

exports.ClockManager = class extends EventEmitter {

  constructor (clock) {
    super()
    this._state = ARMED
    this._clock = clock

    this._clock.on('end', () => {
      this._end()
    })
  }

  get state () {
    return this._state
  }

  start () {
    if (this._state !== ARMED) {
      throw Object.assign(new Error('Clock is not armed'), {
        code: WRONG_STATE_OF_CLOCK_CODE
      })
    }

    this._state = RUNNING
    this.emit('start')
    this._clock.startCountdown(MATCH_TIME)
  }

  _end () {
    if (this._state !== RUNNING) {
      throw Object.assign(new Error('Clock is not running when countdown ended'), {
        code: WRONG_STATE_OF_CLOCK_CODE
      })
    }

    this._state = ENDED
    this.emit('end')
  }

  stop () {
    if (this._state !== RUNNING) {
      throw Object.assign(new Error('Clock is not running'), {
        code: WRONG_STATE_OF_CLOCK_CODE
      })
    }

    this._state = ARMED
    this._clock.stopCountdown()
    this.emit('stop')
  }

  reload () {
    if ([ARMED, ENDED].includes(this._state)) {
      throw Object.assign(new Error('Clock is not ended'), {
        code: WRONG_STATE_OF_CLOCK_CODE
      })
    }

    this._state = ARMED
    this.emit('reload')
  }
}