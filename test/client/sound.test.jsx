import React from 'react'
import chai from 'chai'
import sinon from 'sinon'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinonChai from 'sinon-chai'
import { EventEmitter } from 'events'

import Sound from '../../client/sound/index.jsx'

Enzyme.configure({ adapter: new Adapter() })
chai.use(sinonChai)

const { mount } = Enzyme
const { expect } = chai

describe('Sounds Window', () => {
  let sandbox, listeners, mhubEventEmitter

  beforeEach(() => {
    listeners = {}
    sandbox = sinon.createSandbox()

    window.localStorage.clear()

    sandbox.stub(window, 'focus')

    sandbox.stub(window, 'onbeforeunload')
      .set(fn => {
        listeners.onBeforeUnload = fn
      })

    sandbox.stub(window, 'onunload')
      .set(fn => {
        listeners.onUnload = fn
      })

    sandbox.stub(window, 'onstorage')
      .set(fn => {
        listeners.onStorage = fn
      })

    sandbox.stub(window, 'Audio')

    mhubEventEmitter = new EventEmitter()

    Sound.__Rewire__('onStartEvent', EventEmitter.prototype.on.bind(mhubEventEmitter, 'start'))
    Sound.__Rewire__('onStopEvent', EventEmitter.prototype.on.bind(mhubEventEmitter, 'stop'))
    Sound.__Rewire__('onEndEvent', EventEmitter.prototype.on.bind(mhubEventEmitter, 'end'))
    Sound.__Rewire__('onEndGameEvent', EventEmitter.prototype.on.bind(mhubEventEmitter, 'end-game'))

    Sound.__Rewire__('startSound', 'start-sound')
    Sound.__Rewire__('stopSound', 'stop-sound')
    Sound.__Rewire__('endSound', 'end-sound')
    Sound.__Rewire__('endgameSound', 'end-game-sound')
  })

  afterEach(() => {
    sandbox.restore()
  })

  ;['start', 'stop', 'end', 'end-game'].forEach(event => {
    it(`play ${event} sound when ${event} event triggered`, () => {
      const playSpy = sinon.stub().resolves()
      mount(<Sound />)

      window.Audio.returns({
        play: playSpy
      })

      mhubEventEmitter.emit(event)

      expect(window.Audio).to.have.been.calledWith(`${event}-sound`)
      expect(playSpy).to.have.been.calledOnce
    })

    it(`play ${event} sound when ${event} sound button clicked`, () => {
      const playSpy = sinon.stub().resolves()
      const wrapper = mount(<Sound />)

      window.Audio.returns({
        play: playSpy
      })

      wrapper.find('.item')
        .filterWhere(b => b.text().toLowerCase() === `test ${event.replace('-', ' ')} sound`)
        .simulate('click')

      expect(window.Audio).to.have.been.calledWith(`${event}-sound`)
      expect(playSpy).to.have.been.calledOnce
    })
  })

  it(`prints error when it can't play sound`, done => {
    const error = new Error()
    sandbox.stub(console, 'error')
      .callsFake(() => {
        expect(console.error).to.have.been.calledWith(error)
        done()
      })
    const wrapper = mount(<Sound />)

    window.Audio.returns({
      play: sinon.stub().rejects(error)
    })

    wrapper.instance().playSound()
  })
})
