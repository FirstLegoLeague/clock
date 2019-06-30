const Promise = require('bluebird')
const chai = require('chai')
const { EventEmitter } = require('events')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const { stringContaining } = require('./helpers')

chai.use(sinonChai)
sinon.usingPromise(Promise)
proxyquire.noCallThru()

const { expect } = chai

function capitalize (word) {
  return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
}

const loggerMock = {}

const { linkEvents } = proxyquire('../../server/events-linker', {
  './logger': {
    logger: loggerMock
  }
})

const testsMetadata = [
  {
    event: {
      name: 'clock time',
      service: 'clock',
      key: 'time'
    },
    listener: {
      name: 'clock time event',
      service: 'mhub',
      method: 'sendTimeEvent'
    }
  }
].concat(['prestart', 'start', 'end', 'stop', 'reload'].map(event => {
  return {
    event: {
      name: `clock manager ${event}`,
      service: 'clockManager',
      key: event
    },
    listener: {
      name: `mhub send ${event} event`,
      service: 'mhub',
      method: 'sendEvent',
      args: [event]
    }
  }
}))

describe('Event Linker', () => {
  let mocks

  beforeEach(() => {
    mocks = {
      clockManager: new EventEmitter(),
      clock: Object.assign(new EventEmitter(), {
        onExactTime (time, listener) {
          this.on('exactTime', data => listener(time, data))
        }
      }),
      mhub: {
        sendEvent: sinon.stub().resolves(),
        sendTimeEvent: sinon.stub().resolves()
      }
    }

    loggerMock.error = sinon.stub()
  })

  testsMetadata.forEach(test => {
    test.listener.args = test.listener.args || []

    it(`links ${test.event.name} event with ${test.listener.name} listener`, () => {
      const data = {}

      linkEvents(mocks)
      mocks[test.event.service].emit(test.event.key, data)

      expect(mocks[test.listener.service][test.listener.method])
        .to.have.been.calledWith(...test.listener.args, data)
    })

    it(`adds a error logging when ${test.listener.name} listener`, () => {
      mocks[test.listener.service][test.listener.method].rejects(new Error('the error message'))

      linkEvents(mocks)

      return new Promise(resolve => {
        loggerMock.error.callsFake(resolve)

        mocks[test.event.service].emit(test.event.key)
      })
        .then(() =>
          expect(loggerMock.error).to.have.been.calledWith(stringContaining('the error message')))
    })
  })
})
