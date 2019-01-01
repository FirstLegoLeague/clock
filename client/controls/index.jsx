
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

  renderButtons () {
    switch (this.props.status) {
      case 'armed':
        return [
          <button type='button'
            className={`controls clear success button`}
            onClick={this.startClock}>
            <i className='far fa-play-circle' /> Start
          </button>,
          <button type='button'
            className={`controls clear button`}
            onClick={this.prestartClock}>
            <i className='far fa-clock' /> Countdown
          </button>
        ]
      case 'prerunning':
        return [
          <button type='button'
            className={`controls clear success button`}
            onClick={this.startClock}>
            <i className='fas fa-play' /> Start
          </button>,
          <button type='button'
            className={`controls clear alert button`}
            onClick={this.stopClock}>
            <i className='fas fa-stop' /> Stop
          </button>
        ]
      case 'running':
        return <button type='button'
          className={`controls clear alert button`}
          onClick={this.stopClock}>
          <i className='fas fa-stop' /> Stop
        </button>
      case 'ended':
        return <button type='button'
          className={`controls clear button`}
          onClick={this.reloadClock}>
          <i className='fas fa-step-backward' /> Reload
        </button>
    }
    return null
  }

  render () {
    return <div className='controls-container show-on-hover'>
      {this.renderButtons()}
    </div>
  }
}
