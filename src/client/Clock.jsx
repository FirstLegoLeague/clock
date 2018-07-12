
import axios from 'axios'
import Promise from 'bluebird'
import React, { Component } from 'react'

import { onTimeEvent, onStartEvent, onEndEvent, onReloadEvent, onStopEvent } from './mhub-listener'
import './clock.css'

export default class Clock extends Component {
  constructor (props) {
    super(props)

    this._removeSubscriptions = []

    this.state = {}
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

  componentWillUnmount () {
    this._removeSubscriptions.forEach(removeSubscriptionFunction => {
      removeSubscriptionFunction()
    })
  }

  render () {
    return (
      <p class={ `clock ${this.state.status}` }>
        { this.state.time }
      </p>
    )
  }
}
