
import React, { Component } from 'react'

import './index.css'

export default class Index extends Component {
  render () {
    return (
      <p className={`clock ${this.props.status}`}>
        { this.props.time }
      </p>
    )
  }
}
