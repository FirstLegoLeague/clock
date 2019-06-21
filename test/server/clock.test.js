
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const { Clock } = require('../../server/clock')

chai.use(sinonChai)
const { expect } = chai

const SECOND = 1000
const MILISECOND = 1

describe('Clock', () => {
  let systemTimer
  let clock

  beforeEach(() => {
    systemTimer = sinon.useFakeTimers()
    clock = new Clock()
  })

  afterEach(() => {
    systemTimer.restore()
  })

  it('changes his current time to the given time', () => {
    clock.time = 30

    expect(clock).property('time').to.be.equal(30)
  })

  it('changes the time to the given time in the start of countdown', () => {
    clock.startCountdown(50)

    expect(clock).property('time').to.be.equal(50)
  })

  it('changes the time according to time', () => {
    clock.startCountdown(50)

    systemTimer.tick(30 * SECOND)

    expect(clock).property('time').to.be.equal(20)
  })

  it('changes the time stop changing the time after stopping the countdown', () => {
    clock.startCountdown(50)
    systemTimer.tick(20 * SECOND)
    clock.stopCountdown()
    systemTimer.tick(10 * SECOND)

    expect(clock).property('time').to.be.equal(30)
  })

  it('emit the time event immediately after countdown started', () => {
    const listener = sinon.spy()
    clock.on('time', listener)
    clock.startCountdown(40)

    systemTimer.tick()

    expect(listener).to.have.been.calledOnceWith(40)
  })

  it('emit the time event every second after countdown started', () => {
    const listener = sinon.spy()
    clock.on('time', listener)
    clock.startCountdown(40)

    systemTimer.tick(30 * SECOND)

    expect(listener).to.have.callCount(30)
  })

  it('emit the time event with the current time of the countdown', () => {
    const listener = sinon.spy()
    clock.startCountdown(40)
    systemTimer.tick(30 * SECOND)

    clock.on('time', listener)

    systemTimer.tick(MILISECOND)

    expect(listener).to.have.been.calledOnceWith(10)
  })

  it('emit the end event when countdown ends', () => {
    const listener = sinon.spy()
    clock.on('end', listener)
    clock.startCountdown(40)

    expect(listener).to.have.not.been.called

    systemTimer.tick(40 * SECOND + MILISECOND)

    expect(listener).to.have.been.called
  })

  it('emit the time event before the end event', () => {
    const endListener = sinon.spy()
    const timeListener = sinon.spy()

    clock.startCountdown(40)
    systemTimer.tick(40 * SECOND)

    clock.on('end', endListener)
    clock.on('time', timeListener)

    systemTimer.tick(MILISECOND)

    expect(timeListener).to.have.been.calledBefore(endListener)
  })

  it('emit an event on the exact given time', () => {
    const listener = sinon.spy()
    clock.onExactTime(30, listener)
    clock.startCountdown(40)

    expect(listener).to.have.not.been.called

    systemTimer.tick(30 * SECOND + MILISECOND)

    expect(listener).to.have.been.called
  })
})
