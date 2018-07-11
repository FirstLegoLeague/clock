import React, { Component } from 'react'

import Clock from './Clock.jsx'

import './app.css'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = { username: null }
  }

  componentDidMount () {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }))
  }

  render () {
    return (
      <div>
        <Clock></Clock>
      </div>
    )
  }
}
