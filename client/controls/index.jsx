
import axios from 'axios'
import Promise from 'bluebird'
import React, { Component } from 'react'

import './index.css'

export default class Controls extends Component {
  prestartClock () {
    Promise.resolve(axios.post('/api/action/prestart'))
      .catch(e => {
        console.error(e)
      })
  }

  startClock () {
    Promise.resolve(axios.post('/api/action/start'))
      .catch(e => {
        console.error(e)
      })
  }

  stopClock () {
    Promise.resolve(axios.post('/api/action/stop'))
      .catch(e => {
        console.error(e)
      })
  }

  reloadClock () {
    Promise.resolve(axios.post('/api/action/reload'))
      .catch(e => {
        console.error(e)
      })
  }

  button (buttonClass, callback, icon, label) {
    return <button type='button'
      className={`controls clear ${buttonClass} button`}
      onClick={callback}>
      <i className={icon} /> {label}
    </button>
  }

  startButton () {
    return this.button('success', this.startClock, 'far fa-play-circle', 'Start')
  }

  prestartButton () {
    return this.button('', this.prestartClock, 'far fa-clock', '')
  }

  stopButton () {
    return this.button('alert', this.stopClock, 'fas fa-stop', 'Stop')
  }

  reloadButton () {
    return this.button('', this.reloadClock, 'fas fa-step-backward', 'Reload')
  }

  renderButtons () {
    switch (this.props.status) {
      case 'armed':
        if (this.props.countdownEnabled) {
          return [this.startButton(), this.prestartButton()]
        } else {
          return this.startButton()
        }
      case 'prerunning':
        return [this.startButton(), this.stopButton()]
      case 'running':
        return this.stopButton()
      case 'ended':
        return this.reloadButton()
    }
    return null
  }

  render () {
    return <div className='controls-container show-on-hover'>
      {this.renderButtons()}
    </div>
  }
}
