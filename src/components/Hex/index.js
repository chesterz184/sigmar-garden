import React from 'react'
import './index.css'
import { getTransX, getTransY } from './translate'

function Hex(props) {
  const { hexData, hexRadius } = props
  const { active, selected, pinball } = hexData

  let classList = ['hex-item']
  if(active && pinball) {
    classList.push('active')
  }
  if(selected) {
    classList.push('selected')
  }
  if(pinball) {
    classList.push('shadow')
  }

  let style = {
    top: `calc(50% - ${hexRadius * 1.6}px)`,
    left: `calc(50% - ${hexRadius * 0.7}px)`,
    transform: `translate(${getTransX(hexData.circle, hexData.index, hexRadius)}px, ${getTransY(hexData.circle, hexData.index, hexRadius)}px)`,
    width: `${hexRadius * 1.4}px`,
    height: `${hexRadius * 1.4}px`,
  }

  return (
    <div className={classList.join(' ')} style={style} onClick={(e) => props.clickHex(hexData, e)}>
      <img src={require('../../assets/hovered.png')} alt="" className="atom-hover"/>
      <div className="atom-container">
        {
          pinball && (
            <img src={require(`../../assets/atoms/${pinball.element}.png`)} alt={pinball.element}/>
          )
        }
      </div>
    </div>
  )
}

export default Hex