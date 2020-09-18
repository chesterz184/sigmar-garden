import React from 'react'
import './index.css'

function Status(props) {
  const fadeClass = props.count === 0 ? 'fade' : ''
  const warnClass = (props.oddWarn && props.count % 2 === 1) ? 'warning' : ''
  const imgUrl = require(`../../assets/atoms/${props.element}.png`)

  return <div className={`status-container ${fadeClass}`} style={{backgroundImage: `url(${imgUrl})`}}>
    <span className={`num-left ${warnClass}`}>{props.showCount && props.count}</span>
  </div>
}

export default Status
