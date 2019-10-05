
import React, { Component } from 'react'
import { Dropdown, Button, Icon } from 'semantic-ui-react'

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
    return <Button.Group className='settings show-on-hover'>
      <Dropdown floating labeled button icon='cogs' text='Test sounds' className='primary icon'>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => this.playSound(startSound)}>Start Sound</Dropdown.Item>
          <Dropdown.Item onClick={() => this.playSound(stopSound)}>Stop Sound</Dropdown.Item>
          <Dropdown.Item onClick={() => this.playSound(endSound)}>End Sound</Dropdown.Item>
          <Dropdown.Item onClick={() => this.playSound(endgameSound)}>End Game Sound</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Button color={this.state.enabled ? 'orange' : ''} onClick={() => this.toggleState(this.state.enabled)}>
        <Icon name={`volume ${this.state.enabled ? 'up' : 'off'}`}></Icon>
        {this.state.enabled ? 'Sound on' : 'Sound off'}
      </Button>
    </Button.Group>
  }
}
