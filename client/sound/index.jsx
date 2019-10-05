
import React, { Component } from 'react'

import './index.css'

import startSound from './mp3/start.mp3'
import stopSound from './mp3/stop.mp3'
import endgameSound from './mp3/end-game.mp3'
import endSound from './mp3/end.mp3'

import { onStartEvent, onEndEvent, onStopEvent, onEndGameEvent } from '../mhub-listener'

const startAudio = new window.Audio(startSound)
const stopAudio = new window.Audio(stopSound)
const endgameAudio = new window.Audio(endgameSound)
const endAudio = new window.Audio(endSound)

export default class Sound extends Component {
  constructor (props) {
    super(props)

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
      this.playSound(startAudio)
    })

    onEndGameEvent(() => {
      this.playSound(endgameAudio)
    })

    onEndEvent(() => {
      this.playSound(endAudio)
    })

    onStopEvent(() => {
      this.playSound(stopAudio)
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
        <button className='ui button' type='button' onClick={() => this.playSound(startAudio)} >
            Start Sound
        </button>
        <button className='ui button' type='button' onClick={() => this.playSound(endAudio)} >
            End Sound
        </button>
        <button className='ui button' type='button' onClick={() => this.playSound(stopAudio)} >
            Stop Sound
        </button>
        <button className='ui button' type='button' onClick={() => this.playSound(endgameAudio)} >
            End Game Sound
        </button>
      </div>
    ]
  }
}
