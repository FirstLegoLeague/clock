import React, { Component } from 'react'
import './clock.css'

export default class Clock extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 'armed',
      time: 150 * 1000
    }
  }

  componentDidMount () {
  }

  render () {
    return (
      <p className="clock">
        { this.state.time / 1000 }
      </p>
    )
  }
}
