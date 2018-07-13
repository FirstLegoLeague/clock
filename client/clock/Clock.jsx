
import React, { Component } from 'react'

import './clock.css'

export default class Clock extends Component {
  render () {
    return (
      <p className={`clock ${this.props.status}`}>
        { this.props.time }
      </p>
    )
  }
}
