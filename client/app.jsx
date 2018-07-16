
import axios from 'axios'
import Promise from 'bluebird'
import React, { Component } from 'react'

import Clock from './clock/index.jsx'
import Controls from './controls/index.jsx'
import Settings from './settings/index.jsx'
import { onStartEvent, onEndEvent, onReloadEvent, onStopEvent, onTimeEvent } from './mhub-listener'

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

    Promise.resolve(axios.get('/api/state'))
      .then(res => this.setState({
        status: res.data.status,
        time: res.data.time
      }))
      .catch(err => {
        console.error(err)
      })
  }

  render () {
    return (
      <div>
        <Settings hidden={false} />
        <Clock status={this.state.status} time={this.state.time} format={`clock`} />
        <Controls status={this.state.status} />
      </div>
    )
  }
}
