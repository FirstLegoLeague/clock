import axios from 'axios'
import React, { Component } from 'react'

import './index.css'

const NUMBERS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six']

// This prevent double-clicks from pressing on the button, making an unintentional start/stop of a match
const TIMEOUT_WITHOUT_BUTTONS = 100

export default class Controls extends Component {
  constructor () {
    super()
    this.state = { hideButtons: false }
  }

  prestartClock () {
    axios.post('/api/action/prestart')
      .then(() => this.setTimeoutWithoutButtons())
      .catch(e => {
        console.error(e)
      })
  }

  startClock () {
    axios.post('/api/action/start')
      .then(() => this.setTimeoutWithoutButtons())
      .catch(e => {
        console.error(e)
      })
  }

  stopClock () {
    axios.post('/api/action/stop')
      .then(() => this.setTimeoutWithoutButtons())
      .catch(e => {
        console.error(e)
      })
  }

  reloadClock () {
    axios.post('/api/action/reload')
      .then(() => this.setTimeoutWithoutButtons())
      .catch(e => {
        console.error(e)
      })
  }

  setTimeoutWithoutButtons () {
    this.setState({ hideButtons: true })
    setTimeout(() => {
      this.setState({ hideButtons: false })
    }, TIMEOUT_WITHOUT_BUTTONS)
  }

  button (color, callback, icon, label) {
    return <div className={`ui ${color} icon button`} onClick={callback}>
      <i className={`ui ${icon} icon`} />
      {label}
    </div>
  }

  startButton () {
    return this.button('green', () => this.startClock(), 'play', 'Start')
  }

  prestartButton () {
    return this.button('orange', () => this.prestartClock(), 'stopwatch', 'Start after delay')
  }

  stopButton () {
    return this.button('red', () => this.stopClock(), 'stop', 'Abort')
  }

  reloadButton () {
    return this.button('orange', () => this.reloadClock(), 'undo', 'Reload')
  }

  renderButtons () {
    if (this.state.hideButtons) {
      return []
    }

    switch (this.props.status) {
      case 'armed':
        if (this.props.countdownEnabled) {
          return [this.startButton(), this.prestartButton()]
        } else {
          return [this.startButton()]
        }
      case 'prerunning':
        return [this.stopButton()]
      case 'running':
        return [this.stopButton()]
      case 'ended':
        return [this.reloadButton()]
    }
    return []
  }

  render () {
    const buttons = this.renderButtons()
    return <div className='controls-container show-on-hover ui buttons'>
      <div className={`ui ${NUMBERS[buttons.length]} huge buttons`}>
        {buttons}
      </div>
    </div>
  }
}
