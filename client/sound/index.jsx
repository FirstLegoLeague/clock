
import React, { Component } from 'react'

import { onStartEvent, onEndEvent, onStopEvent, onEndGameEvent } from '../mhub-listener'

import './index.css'

import startSound from './mp3/start.mp3'
import stopSound from './mp3/stop.mp3'
import endgameSound from './mp3/end-game.mp3'
import endSound from './mp3/end.mp3'

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
      this.testSound(startSound)
    })

    onEndGameEvent(() => {
      this.testSound(endgameSound)
    })

    onEndEvent(() => {
      this.testSound(endSound)
    })

    onStopEvent(() => {
      this.testSound(stopSound)
    })

    this.state = {}
  }

  testSound (sound) {
    const audio = new window.Audio(sound)
    audio.play()
      .catch(err => {
        console.error(err)
      })
  }

  openSoundWindow () {
    window.open('/sound.html', 'sound-window', 'height=200,width=150')
  }

  render () {
    return [
      <h1>Test sounds</h1>,
      <div className={'large expanded button-group'}>
        <button className='button' type='button' onClick={() => this.testSound(startSound)} >
            Start Sound
        </button>
        <button className='button' type='button' onClick={() => this.testSound(endSound)} >
            End Sound
        </button>
        <button className='button' type='button' onClick={() => this.testSound(stopSound)} >
            Stop Sound
        </button>
        <button className='button' type='button' onClick={() => this.testSound(endgameSound)} >
            End Game Sound
        </button>
      </div>
    ]
  }
}
