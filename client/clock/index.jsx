
import React from 'react'

import './index.css'

function parseTime (time, format) {
  switch (format) {
    case 'clock':
      return `${(time / 60) | 0}:${(time % 60) | 0}`
    case 'seconds':
    default:
      return `${time | 0}`
  }
}

export default function Clock (props) {
  return (
    <p className={`clock ${props.status}`}>
      { parseTime(props.time, props.format) }
    </p>
  )
}
