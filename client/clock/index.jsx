
import React from 'react'

import './index.css'

function pad (number, length) {
  return (new Array(length + 1).join('0') + number).slice(-length)
}

function parseTime (time, format) {
  switch (format) {
    case 'clock':
      return `${pad(Math.floor(time / 60), 2)}:${pad(time % 60, 2)}`
    case 'seconds':
    default:
      return `${time | 0}`
  }
}

export default function Clock (props) {
  return (
    <div className={`clock ${props.status}`}>
      { parseTime(props.time, props.format) }
    </div>
  )
}
