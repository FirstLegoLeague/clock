
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
    switch (this.props.status) {
      case 'armed':
        return <button type='button'
          className={`controls show-on-hover clear success button`}
          onClick={this.startClock}>
          <i className='fas fa-play' /> Start
        </button>
      case 'ended':
        return <button type='button'
          className={`controls show-on-hover clear button`}
          onClick={this.reloadClock}>
          <i className='fas fa-step-backward' /> Reload
        </button>
      case 'running':
        return <button type='button'
          className={`controls show-on-hover clear alert button`}
          onClick={this.stopClock}>
          <i className='fas fa-stop' /> Stop
        </button>
    }
    return null
  }
}
