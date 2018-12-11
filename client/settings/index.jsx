
import axios from 'axios'
import Promise from 'bluebird'
import Modal from 'react-foundation-modal'
import React, { Component } from 'react'

import './index.css'

export default class Settings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modalIsOpen: false
    }
  }

  testSound (sound) {
    Promise.resolve(axios.post(`/api/sound/${sound}`))
      .catch(e => {
        console.error(e)
      })
  }

  showPopup (status) {
    this.setState({
      modalIsOpen: status
    })
  }

  render () {
    return (<div className='show-on-hover settings'>
      <button className='large button' onClick={() => this.showPopup(true)}>
        <i className='fas fa-music' />
      </button>
      <Modal
        open={this.state.modalIsOpen}
        closeModal={() => this.showPopup(false)}
        isModal
        size='large'>
        <h1>Test sounds</h1>
        <div className={'large expanded button-group'}>
          <button className='button' type='button' onClick={() => this.testSound('start')} >
            Start Sound
          </button>
          <button className='button' type='button' onClick={() => this.testSound('end')} >
            End Sound
          </button>
          <button className='button' type='button' onClick={() => this.testSound('stop')} >
            Stop Sound
          </button>
          <button className='button' type='button' onClick={() => this.testSound('endgame')} >
            End Game Sound
          </button>
        </div>
      </Modal>
    </div>)
  }
}
