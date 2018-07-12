
import axios from 'axios'
import Promise from 'bluebird'
import React, { Component } from 'react'

import './index.css'

export default class Controls extends Component {

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

  render () {
    return (
      <h1 className={`controls expanded button-group`}>
        <button type="button"
                className={`success button`}
                onClick={this.startClock}
                disabled={this.props.status !== 'armed'}>
          Start
        </button>
        <button type="button"
                className={`button`}
                onClick={this.reloadClock}
                disabled={this.props.status !== 'ended'}>
          Reload
        </button>
        <button type="button"
                className={`alert button`}
                onClick={this.stopClock}
                disabled={this.props.status !== 'running'}>
          Stop
        </button>
      </h1>
    )
  }
}