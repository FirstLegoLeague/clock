
import React, { Component } from 'react'

import './index.css'

export default class Settings extends Component {
  constructor (props) {
    super(props)

    window.onstorage = event => {
      if (event.key === 'sound-window') {
        this.setState({ sound: Boolean(event.newValue) })
      }
    }

    this.state = {
      sound: Boolean(window.localStorage.getItem('sound-window'))
    }
  }

  openSoundWindow () {
    if (!this.state.sound) {
      window.open('/sound.html', 'sound-window', 'height=200,width=700')
    }
  }

  render () {
    return (<div className='show-on-hover settings'>
      <button className='large clear button' onClick={() => this.openSoundWindow()} disabled={this.state.sound}>
        <i className={`fas fa-volume-${this.state.sound ? 'up' : 'off'}`} />
      </button>
    </div>)
  }
}
