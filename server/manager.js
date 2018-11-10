const ARMED = 'armed'
const RUNNING = 'running'
const ENDED = 'ended'

const EventEmitter = require('events')

const WRONG_STATE_OF_CLOCK_CODE = exports.WRONG_STATE_OF_CLOCK_CODE = 'WRONG_STATE_OF_CLOCK'

const MATCH_TIME = (process.env.NODE_ENV === 'development') ? 35 : 150
const MATCH_TIME_BUFFER = 5

exports.ClockManager = class extends EventEmitter {
  constructor (clock, timeSaver) {
    super()
    this._status = ARMED
    this._clock = clock
    this._timeSaver = timeSaver

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
    this._timeSaver.writeTimeToFile(new Date())
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
    this._timeSaver.clearFile()
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

    this._timeSaver.getTimeFromFile().then(time => {
      if (time) {
        this._status = RUNNING

        const currentTime = new Date()
        const timeRan = Math.floor((currentTime.getTime() - time.getTime()) / 1000)
        const matchTimeWithBuffer = MATCH_TIME + MATCH_TIME_BUFFER

        if (timeRan < matchTimeWithBuffer) {
          const timeLeft = matchTimeWithBuffer - timeRan
          this._clock.startCountdown(timeLeft)
        } else {
          this._clock.startCountdown(0)
        }
      }
    })

    this._status = ARMED
    this._clock.setTime(MATCH_TIME)
    this.emit('reload')
  }
}
