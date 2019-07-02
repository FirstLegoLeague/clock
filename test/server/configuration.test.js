const chai = require('chai')
const { EventEmitter } = require('events')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const { env, stringContaining } = require('../helpers')

chai.use(sinonChai)
sinon.usingPromise(global.Promise)
proxyquire
  .noCallThru()
  .noPreserveCache()

const { expect } = chai

const CONFIGURATION_NODE = 'configuration'
const CONFIGURATION_TOPIC = 'config:clock'

describe('Config Manager', () => {
  let MClientStub, mClientMock, loggerMock, mhubServiceMock

  beforeEach(() => {
    mClientMock = Object.assign(new EventEmitter(), {
      connect: sinon.stub().resolves(),
      login: sinon.stub().resolves(),
      subscribe: sinon.stub().resolves()
    })

    MClientStub = sinon.stub()
      .returns(mClientMock)

    loggerMock = {
      info: sinon.stub(),
      error: sinon.stub()
    }

    mhubServiceMock = {
      sendClockFormat: sinon.stub().resolves()
    }
  })

  afterEach(() => {
  })

  const createConfigManager = () => {
    return proxyquire('../../server/configuration', {
      'mhub': {
        MClient: MClientStub
      },
      './logger': {
        logger: loggerMock
      }
    })
  }

  it('uses the environment variable to get mhub uri', () => {
    const mhubUri = 'ws://my.mhub.com:19200'

    return env({ 'MHUB_URI': mhubUri }, () => {
      createConfigManager()

      expect(MClientStub).to.have.been.calledWith(mhubUri)
    })
  })

  it('connects to mhub', () => {
    const config = createConfigManager()

    return config.linkConfiguration({ mhub: mhubServiceMock })
      .then(() => expect(mClientMock.connect).to.have.been.calledOnce)
  })

  it('logs in with \'configuration\' username and password from the environment variables', () => {
    const username = 'configuration'
    const password = 'secret'

    return env({ 'SECRET': password }, () => {
      const config = createConfigManager()

      return config.linkConfiguration({ mhub: mhubServiceMock })
        .then(() => expect(mClientMock.login).to.have.been.calledWith(username, password))
    })
  })

  it('logs in after connecting to mhub', () => {
    const config = createConfigManager()

    return config.linkConfiguration({ mhub: mhubServiceMock })
      .then(() => expect(mClientMock.login).to.have.been.calledAfter(mClientMock.connect))
  })

  it('log an error when can\'t connect to mhub', () => {
    mClientMock.login.rejects(new Error('message'))
    const config = createConfigManager()

    return config.linkConfiguration({ mhub: mhubServiceMock })
      .then(() => expect(loggerMock.error).to.have.been.calledWith(stringContaining('message')))
  })

  it('sends clock format to mhub service when gets a configuration message', () => {
    const config = createConfigManager()

    return config.linkConfiguration({ mhub: mhubServiceMock })
      .then(() => mClientMock.emit('message', {
        topic: CONFIGURATION_TOPIC,
        data: {
          fields: [
            { name: 'clockFormat', value: 'seconds' },
            { name: 'precount', value: 0 }
          ]
        }
      }))
      .then(() => {
        expect(mhubServiceMock.sendClockFormat).to.have.been.calledWith('seconds')
      })
  })

  it('subscribes to the configuration topic', () => {
    const config = createConfigManager()

    return config.linkConfiguration({ mhub: mhubServiceMock })
      .then(() => {
        expect(mClientMock.subscribe).to.have.been.calledWith(CONFIGURATION_NODE, CONFIGURATION_TOPIC)
      })
  })

  it('returns the newest configuration', () => {
    const config = createConfigManager()

    return config.linkConfiguration({ mhub: mhubServiceMock })
      .then(() => mClientMock.emit('message', {
        topic: CONFIGURATION_TOPIC,
        data: {
          fields: [
            { name: 'clockFormat', value: 'seconds' },
            { name: 'precount', value: 5 }
          ]
        }
      }))
      .then(() => {
        expect(config.getCurrentConfig()).to.be.deep.equal({
          clockFormat: 'seconds',
          precount: 5
        })
      })
  })
})
