
import React from 'react'

import './index.css'

function pad(number, length) {
  return ("0" + number).slice(-length)
}

function parseTime (time, format) {
  switch (format) {
    case 'clock':
      return `${pad(time / 60) | '00'}:${pad(time % 60) | '00'}`
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
