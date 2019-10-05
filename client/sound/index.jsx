
import React, { Component } from 'react'

import './index.css'

import startSound from './mp3/start.mp3'
import stopSound from './mp3/stop.mp3'
import endgameSound from './mp3/end-game.mp3'
import endSound from './mp3/end.mp3'

import { onStartEvent, onEndEvent, onStopEvent, onEndGameEvent } from '../mhub-listener'

export default class Sound extends Component {
  constructor (props) {
    super(props)

    this.startAudio = new window.Audio(startSound)
    this.stopAudio = new window.Audio(stopSound)
    this.endgameAudio = new window.Audio(endgameSound)
    this.endAudio = new window.Audio(endSound)

    window.localStorage.setItem('sound-window', true)

    window.onbeforeunload = function () {
      return 'Closing this window will stop the sounds of the timer. Are you sure you want to close it?'
    }

    window.onunload = () => {
      window.localStorage.removeItem('sound-window')
    }

    window.onstorage = event => {
      if (event.key === 'focus' && event.newValue) {
        window.focus()
        window.localStorage.removeItem('focus')
      }
    }

    onStartEvent(() => {
      this.playSound(this.startAudio)
    })

    onEndGameEvent(() => {
      this.playSound(this.endgameAudio)
    })

    onEndEvent(() => {
      this.playSound(this.endAudio)
    })

    onStopEvent(() => {
      this.playSound(this.stopAudio)
    })

    this.state = {}
  }

  playSound (audio) {
    audio.play()
      .catch(err => {
        console.error(err)
      })
  }

  render () {
    return [
      <h1>Test sounds</h1>,
      <div className={'ui large buttons'}>
        <button className='ui button' type='button' onClick={() => this.playSound(this.startAudio)} >
            Start Sound
        </button>
        <button className='ui button' type='button' onClick={() => this.playSound(this.endAudio)} >
            End Sound
        </button>
        <button className='ui button' type='button' onClick={() => this.playSound(this.stopAudio)} >
            Stop Sound
        </button>
        <button className='ui button' type='button' onClick={() => this.playSound(this.endgameAudio)} >
            End Game Sound
        </button>
      </div>
    ]
  }
}
