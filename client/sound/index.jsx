
import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'

import './index.css'

import startSound from './mp3/start.mp3'
import stopSound from './mp3/stop.mp3'
import endgameSound from './mp3/end-game.mp3'
import endSound from './mp3/end.mp3'

import { onStartEvent, onEndEvent, onStopEvent, onEndGameEvent } from '../mhub-listener'

export default class Sound extends Component {
  constructor (props) {
    super(props)

    onStartEvent(() => {
      this.soundEvent(startSound)
    })

    onEndGameEvent(() => {
      this.soundEvent(endgameSound)
    })

    onEndEvent(() => {
      this.soundEvent(endSound)
    })

    onStopEvent(() => {
      this.soundEvent(stopSound)
    })

    this.soundEvent = sound => this.playSound(sound)
    this.state = { enabled: true }
  }

  playSound (sound) {
    const audio = new window.Audio(sound)
    audio.play()
      .catch(err => {
        console.error(err)
      })
  }

  toggleState (isEnabled) {
    if (isEnabled) {
      this.setState({ enabled: false })
      this.soundEvent = () => {}
    } else {
      this.setState({ enabled: true })
      this.soundEvent = sound => this.playSound(sound)
    }
  }

  render () {
    return <div className='sound-line'>
      <div className='settings'>
        <Dropdown className='huge icon' icon='cogs' button>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => this.toggleState(this.state.enabled)}>
              {this.state.enabled ? 'Disable sound' : 'Enable sound'}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => this.playSound(startSound)}>Test Start Sound</Dropdown.Item>
            <Dropdown.Item onClick={() => this.playSound(stopSound)}>Test Stop Sound</Dropdown.Item>
            <Dropdown.Item onClick={() => this.playSound(endSound)}>Test End Sound</Dropdown.Item>
            <Dropdown.Item onClick={() => this.playSound(endgameSound)}>Test End Game Sound</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className='indicator'>
        <div className={'ui float right icon'}>
          <i className={`ui volume ${this.state.enabled ? 'up' : 'off'} orange huge icon`} />
        </div>
      </div>
    </div>
  }
}
