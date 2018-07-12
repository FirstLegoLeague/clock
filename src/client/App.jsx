import React, { Component } from 'react'

import Clock from './clock/Clock.jsx'

import './app.css'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = { username: null }
  }

  componentDidMount () {
  }

  render () {
    return (
      <div>
        <Clock></Clock>
      </div>
    )
  }
}
