import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import Settings from '../../client/settings/index.jsx'

Enzyme.configure({ adapter: new Adapter() })
chai.use(chaiEnzyme())
chai.use(sinonChai)

const { mount } = Enzyme
const { expect } = chai

describe('Settings Component', () => {
 let onStorageListener

   beforeEach(() => {
    window.localStorage.clear()

    const onStorageStub = sinon.stub(window, 'onstorage')
      .get(() => onStorageStub)
      .set(fn => {
        onStorageListener = fn
      })

    sinon.stub(window, 'open')
  })

  afterEach(() => {
    window.onstorage.restore()
    window.open.restore()
  })

  it('shows the sound off icon when created without sound-window key in the local storage', () => {
    const wrapper = mount(<Settings />)

    expect(wrapper.find('.fas')).to.have.className('fa-volume-off')
  })

  it('shows the sound up icon when created with sound-window key in the local storage', () => {
    window.localStorage.setItem('sound-window', true)
    const wrapper = mount(<Settings />)

    expect(wrapper.find('.fas')).to.have.className('fa-volume-up')
  })

  it('does nothing when local storage changed on other key then sound-window', () => {
    const wrapper = mount(<Settings />)

    onStorageListener({ key: 'other-key', newValue: 'true' })

    expect(wrapper.find('.fas')).to.have.className('fa-volume-off')
  })

  it('shows the sound off icon when created without sound-window key in the local storage', () => {
    const wrapper = mount(<Settings />)

    expect(wrapper.find('i.icon')).to.have.className('music')
  })

  it('opens a new window when icon has been clicked', () => {
    const wrapper = mount(<Settings />)

    wrapper.find('.button').simulate('click')

    expect(window.open).to.have.been.calledWith('/sound.html')
  })

  it('does not open a new window when icon has been clicked and sound window exists', () => {
    window.localStorage.setItem('sound-window', true)
    const wrapper = mount(<Settings />)

    wrapper.find('.button').simulate('click')

    expect(window.open).to.have.not.been.calledWith('/sound.html')
  })
})
