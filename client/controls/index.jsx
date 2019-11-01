
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

  button (color, callback, icon, label) {
    return <div className='controls' onClick={callback}>
      <i className={`ui ${icon} ${color} link huge icon`} />
      <div className={`hover text ui ${color} header`}>{label}</div>
    </div>
  }

  startButton () {
    return this.button('green', this.startClock, 'play', 'Start')
  }

  prestartButton () {
    return this.button('orange', this.prestartClock, 'stopwatch', 'Start after delay')
  }

  stopButton () {
    return this.button('red', this.stopClock, 'stop', 'Abort')
  }

  reloadButton () {
    return this.button('orange', this.reloadClock, 'undo', 'Reload')
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
        return [this.stopButton()]
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
