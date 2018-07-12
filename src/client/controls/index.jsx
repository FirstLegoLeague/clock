
import axios from 'axios'
import Promise from 'bluebird'
import React, { Component } from 'react'

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
      <p>
        <button onClick={this.startClock} disabled={this.props.status !== 'armed'}>Start</button>
        <button onClick={this.reloadClock} disabled={this.props.status !== 'ended'}>Reload</button>
        <button onClick={this.stopClock} disabled={this.props.status !== 'running'}>Stop</button>
      </p>
    )
  }
}