
import axios from 'axios'
import Promise from 'bluebird'
import React, { Component } from 'react'

import Clock from './clock/index.jsx'
import Controls from './controls/index.jsx'
import Settings from './settings/index.jsx'
import { onStartEvent, onEndEvent, onReloadEvent,
  onStopEvent, onTimeEvent, onFormatChangedEvent } from './mhub-listener'

export default class App extends Component {
  constructor (props) {
    super(props)

    this._removeSubscriptions = []

    this.state = {
      status: null,
      time: null
    }
  }

  componentDidMount () {
    onTimeEvent(({ time }) => {
      this.setState({ time })
    })
      .then(removeSubscription => { this._removeSubscriptions.push(removeSubscription) })
      .catch(err => {
        console.error(err)
      })

    onStartEvent(() => {
      this.setState({ status: 'running' })
    })
      .then(removeSubscription => { this._removeSubscriptions.push(removeSubscription) })
      .catch(err => {
        console.error(err)
      })

    onStopEvent(() => {
      this.setState({ status: 'armed' })
    })
      .then(removeSubscription => { this._removeSubscriptions.push(removeSubscription) })
      .catch(err => {
        console.error(err)
      })

    onReloadEvent(() => {
      this.setState({ status: 'armed' })
    })
      .then(removeSubscription => { this._removeSubscriptions.push(removeSubscription) })
      .catch(err => {
        console.error(err)
      })

    onEndEvent(() => {
      this.setState({ status: 'ended' })
    })
      .then(removeSubscription => { this._removeSubscriptions.push(removeSubscription) })
      .catch(err => {
        console.error(err)
      })

    onFormatChangedEvent(({ format }) => {
      this.setState({ clockFormat: format })
    })
      .then(removeSubscription => { this._removeSubscriptions.push(removeSubscription) })
      .catch(err => {
        console.error(err)
      })

    Promise.resolve(axios.get('/api/startup'))
      .then(res => this.setState({
        status: res.data.status,
        time: res.data.time,
        clockFormat: res.data.clockFormat
      }))
      .catch(err => {
        console.error(err)
      })
  }

  render () {
    return [
      <Settings hidden={false} />,
      <Clock status={this.state.status} time={this.state.time} format={this.state.clockFormat} />,
      <Controls status={this.state.status} />
    ]
  }
}
