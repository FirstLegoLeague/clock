const chai = require('chai')
const { EventEmitter } = require('events')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const sinonChai = require('sinon-chai')

const { stringContaining } = require('./helpers')

chai.use(sinonChai)
proxyquire.noCallThru()

const { expect } = chai
const loggerMock = {
  error: sinon.stub()
}

const { ClockManager } = proxyquire('../../server/manager', {
  './logger': {
    logger: loggerMock
  }
})

const MATCH_TIME = 150

describe('Clock Manager', () => {
  let clockManager, clockMock, timeSaverMock, configMock, systemTimers, sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    systemTimers = sandbox.useFakeTimers()

    clockMock = Object.assign(new EventEmitter(), {
      setTime: sandbox.stub(),
      startCountdown: sandbox.stub(),
      stopCountdown: sandbox.stub()
    })

    timeSaverMock = {
      getTime: sandbox.stub().resolves(),
      saveTime: sandbox.stub(),
      clearTime: sandbox.stub()
    }

    configMock = {
      getCurrentConfig: sandbox.stub().returns({ precount: 5 })
    }

    clockManager = new ClockManager(clockMock, timeSaverMock, configMock)
    systemTimers.tick()
  })

  afterEach(() => {
    systemTimers.restore()
  })

  function setupPrerunningClockManager () {
    configMock.getCurrentConfig.returns({ precount: 5 })
    clockManager.prestart()
    sandbox.resetHistory()
  }

  function setupRunningClockManager () {
    configMock.getCurrentConfig.returns({ precount: 0 })
    clockManager.prestart()

    sandbox.resetHistory()
  }

  function setupEndedClockManager () {
    configMock.getCurrentConfig.returns({ precount: 0 })
    clockManager.prestart()
    clockMock.emit('end')

    sandbox.resetHistory()
  }

  it('starts with status "armed"', () => {
    expect(clockManager).property('status').to.be.equal('armed')
  })

  it('change status to "running" after when prestarting with zero precount', () => {
    configMock.getCurrentConfig.returns({ precount: 0 })

    clockManager.prestart()

    expect(clockManager).property('status').to.be.equal('running')
  })

  it('send start event when prestarting with zero precount', () => {
    const startListener = sinon.spy()
    clockManager.on('start', startListener)
    configMock.getCurrentConfig.returns({ precount: 0 })

    clockManager.prestart()

    expect(startListener).to.have.been.calledOnce
  })

  it('saves the time when prestarting with zero precount', () => {
    configMock.getCurrentConfig.returns({ precount: 0 })
    systemTimers.tick(7133)

    clockManager.prestart()

    expect(timeSaverMock.saveTime).to.have.been.calledWith(new Date(7133))
  })

  it('starts the countdown with match time when prestarting with zero precount', () => {
    configMock.getCurrentConfig.returns({ precount: 0 })

    clockManager.prestart()

    expect(clockMock.startCountdown).to.have.been.calledWith(MATCH_TIME)
  })

  it('change status to "prerunning" after when prestarting with positive precount', () => {
    configMock.getCurrentConfig.returns({ precount: 5 })

    clockManager.prestart()

    expect(clockManager).property('status').to.be.equal('prerunning')
  })

  it('send prestart event when prestarting with positive precount', () => {
    const prestartListener = sinon.spy()
    clockManager.on('prestart', prestartListener)
    configMock.getCurrentConfig.returns({ precount: 5 })

    clockManager.prestart()

    expect(prestartListener).to.have.been.calledOnce
  })

  it('starts the countdown with the precount when prestarting with positive precount', () => {
    configMock.getCurrentConfig.returns({ precount: 5 })

    clockManager.prestart()

    expect(clockMock.startCountdown).to.have.been.calledWith(5)
  })

  it('change status to "running" after when countdown of the precount ends', () => {
    setupPrerunningClockManager()

    clockMock.emit('end')
    systemTimers.tick()

    expect(clockManager).property('status').to.be.equal('running')
  })

  it('send start event when countdown of the precount ends', () => {
    setupPrerunningClockManager()
    const startListener = sinon.spy()
    clockManager.on('start', startListener)

    clockMock.emit('end')
    systemTimers.tick()

    expect(startListener).to.have.been.calledOnce
  })

  it('saves the time when countdown of the precount ends', () => {
    setupPrerunningClockManager()

    systemTimers.tick(7133)
    clockMock.emit('end')
    systemTimers.tick()

    expect(timeSaverMock.saveTime).to.have.been.calledWith(new Date(7133))
  })

  it('starts the countdown with match time when countdown of the precount ends', () => {
    configMock.getCurrentConfig.returns({ precount: 5 })

    clockManager.prestart()
    clockMock.emit('end')
    systemTimers.tick()

    expect(clockMock.startCountdown).to.have.been.calledWith(MATCH_TIME)
  })

  it('change status to "armed" when stopped', () => {
    setupRunningClockManager()

    clockManager.stop()

    expect(clockManager).property('status').to.be.equal('armed')
  })

  it('stops the clock countdown when stopped', () => {
    setupRunningClockManager()

    clockManager.stop()

    expect(clockMock.stopCountdown).to.have.been.calledOnce
  })

  it('sets the clock to match time when stopped', () => {
    setupRunningClockManager()

    clockManager.stop()

    expect(clockMock.setTime).to.have.been.calledWith(MATCH_TIME)
  })

  it('emits a stop event when stopped', () => {
    setupRunningClockManager()
    const stopListener = sinon.spy()
    clockManager.on('stop', stopListener)

    clockManager.stop()

    expect(stopListener).to.have.been.calledOnce
  })

  it('clears the time saver when stopped', () => {
    setupRunningClockManager()

    clockManager.stop()

    expect(timeSaverMock.clearTime).to.have.been.calledOnce
  })

  it('changes status to "ended" when clock countdown ended', () => {
    setupRunningClockManager()

    clockMock.emit('end')

    expect(clockManager).property('status').to.be.equal('ended')
  })

  it('emits the end event when clock countdown ended', () => {
    setupRunningClockManager()
    const endListener = sinon.spy()
    clockManager.on('end', endListener)

    clockMock.emit('end')

    expect(endListener).to.have.been.calledOnce
  })

  it('clears the time saver when clock countdown ended', () => {
    setupRunningClockManager()

    clockMock.emit('end')

    expect(timeSaverMock.clearTime).to.have.been.calledOnce
  })

  it('changes status to "armed" when reloaded', () => {
    setupEndedClockManager()

    return clockManager.reload()
      .then(() => {
        expect(clockManager).property('status').to.be.equal('armed')
      })
  })

  it('sets the clock to match time when reloaded', () => {
    setupEndedClockManager()

    return clockManager.reload()
      .then(() => {
        expect(clockMock.setTime).to.have.been.calledWith(MATCH_TIME)
      })
  })

  it('emits reload event when reloaded', () => {
    setupEndedClockManager()
    const reloadListener = sinon.spy()
    clockManager.on('reload', reloadListener)

    return clockManager.reload()
      .then(() => {
        expect(reloadListener).to.have.been.called
      })
  })

  it('throws an error when prestarting on non-armed status', () => {
    setupRunningClockManager()

    expect(() => clockManager.prestart()).to.throw()
  })

  it('throws an error when stopped on non-running status', () => {
    setupEndedClockManager()

    expect(() => clockManager.stop()).to.throw()
  })

  it('throws an error when clock ends on non-running status', () => {
    setupEndedClockManager()

    expect(() => clockMock.emit('end')).to.throw()
  })

  it('logs an error message when timeSaver fails to retrieve time on reload', () => {
    setupEndedClockManager()
    timeSaverMock.getTime.rejects('error message')

    return clockManager.reload()
      .then(() => {
        expect(loggerMock.error).to.have.been.calledWith(stringContaining('error message'))
      })
  })

  it('sets the clock to match time when timeSaver fails to retrieve time on reload', () => {
    setupEndedClockManager()
    timeSaverMock.getTime.rejects()

    return clockManager.reload()
      .then(() => {
        expect(clockMock.setTime).to.have.been.calledWith(MATCH_TIME)
      })
  })

  it('changes status to "armed" when timeSaver fails to retrieve time on reload', () => {
    setupEndedClockManager()
    timeSaverMock.getTime.rejects()

    return clockManager.reload()
      .then(() => {
        expect(clockManager).property('status').to.be.equal('armed')
      })
  })

  it('emits reload event when timeSaver fails to retrieve time on reload', () => {
    setupEndedClockManager()
    timeSaverMock.getTime.rejects()
    const reloadListener = sinon.spy()
    clockManager.on('reload', reloadListener)

    return clockManager.reload()
      .then(() => {
        expect(reloadListener).to.have.been.called
      })
  })
})
