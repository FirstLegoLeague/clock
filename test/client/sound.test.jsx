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

  it('sets sound-window key in local storage when created', () => {
    mount(<Sound />)
    expect(window.localStorage).to.have.property('sound-window').which.is.equal('true')
  })

  it('removes sound-window key from local storage when unloading', () => {
    mount(<Sound />)
    sandbox.resetHistory()

    listeners.onUnload()

    expect(window.localStorage).to.not.have.property('sound-window')
  })

  it('claims focus on the window when "focus" key is created in local storage', () => {
    mount(<Sound />)

    listeners.onStorage({ key: 'focus', newValue: 'true' })

    expect(window.focus).to.have.been.calledOnce
  })

  it('remove the "focus" key when "focus" key is created in local storage', () => {
    mount(<Sound />)
    window.localStorage.setItem('focus', 'true')

    listeners.onStorage({ key: 'focus', newValue: 'true' })

    expect(window.localStorage).to.not.have.property('focus')
  })

  it('not doing anything when key is changed in local storage other then "focus"', () => {
    mount(<Sound />)
    window.localStorage.setItem('focus', 'true')

    listeners.onStorage({ key: 'other', newValue: 'true' })

    expect(window.focus).to.have.not.been.called
    expect(window.localStorage).to.have.property('focus')
  })

  it('not doing anything when key is "focus" key is removed from local storage', () => {
    mount(<Sound />)
    window.localStorage.setItem('focus', 'true')

    listeners.onStorage({ key: 'other', newValue: null })

    expect(window.focus).to.have.not.been.called
    expect(window.localStorage).to.have.property('focus')
  })

  it('sets closing message', () => {
    mount(<Sound />)

    expect(listeners.onBeforeUnload()).to.match(/Are you sure/)
  })

  ;['start', 'stop', 'end', 'end-game'].forEach(event => {
    it(`play ${event} sound when ${event} event triggered`, () => {
      const playSpy = sinon.stub().resolves()
      window.Audio.returns({
        play: playSpy
      })

      mount(<Sound />)

      mhubEventEmitter.emit(event)

      expect(window.Audio).to.have.been.calledWith(`${event}-sound`)
      expect(playSpy).to.have.been.calledOnce
    })

    it(`play ${event} sound when ${event} sound button clicked`, () => {
      const playSpy = sinon.stub().resolves()
      window.Audio.returns({
        play: playSpy
      })

      const wrapper = mount(<Sound />)

      wrapper.find('button')
        .filterWhere(b => b.text().toLowerCase() === `${event.replace('-', ' ')} sound`)
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

    wrapper.instance().playSound({
      play: sinon.stub().rejects(error)
    })
  })
})
