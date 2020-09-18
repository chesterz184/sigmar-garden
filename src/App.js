import React, { useState, useEffect } from 'react'
import './App.css'
import Game from './lib/Game'
import Hex from './components/Hex'
import Status from './components/Status'

const game = new Game()
game.initGame()

const coords = game.getFlatCoords()
const initStatus = Game.getInitStatus()
const size = 91

let isRendering = false

function App() {
  const [hexList, setHexList] = useState([])
  const [status] = useState(initStatus)
  const [winCount, setWinCount] = useState(0)
  const [showHelp, setShowHelp] = useState(false)

  const onClickHex = (hex) => {
    game.select(hex)
    setHexList([...coords])
    Game.updateStatus(hexList, status)
    if (game.win) {
      setWinCount(winCount + 1)
    }
  }

  const insert = (index) => {
    if (index < size) {
      let interval = coords[index].pinball ? 70 : 0
      setHexList((list) => {
        return [...list, coords[index]]
      })
      setTimeout(() => {
        insert(index + 1)
      }, interval)
    } else {
      isRendering = false
    }
  }

  const newGame = () => {
    if (isRendering) {
      return
    }
    isRendering = true
    game.initGame()
    setHexList([])
    insert(0)
  }

  useEffect(() => {
    Game.updateStatus(hexList, status)
  })

  return (
    <div className="app">
      <div className="board">
        {hexList.map((hex) => (
          <Hex clickHex={onClickHex} hexData={hex} hexRadius={38.1} key={hex.circle + '-' + hex.index}></Hex>
        ))}

        <div className="board-footer">
          <button style={{ fontSize: `${38.1 / 2.6}px` }} className="btn-start" onClick={() => newGame()}>
            NEW GAME
          </button>
          <div className="status-bar">
            <Status {...status.salt}></Status>
            <span className="status-divide">|</span>
            <Status {...status.air}></Status>
            <Status {...status.fire}></Status>
            <Status {...status.water}></Status>
            <Status {...status.earth}></Status>
            <span className="status-divide">|</span>
            <Status {...status.quicksilver}></Status>
            <span className="status-divide">|</span>
            <Status {...status.lead}></Status>
            <Status {...status.tin}></Status>
            <Status {...status.iron}></Status>
            <Status {...status.copper}></Status>
            <Status {...status.silver}></Status>
            <Status {...status.gold}></Status>
          </div>
          <button className="btn-help" onClick={() => setShowHelp(true)}></button>
          <div className="record">
            <span>WINS</span>
            <span>{winCount}</span>
          </div>
        </div>
      </div>
      {showHelp && <img className="help-content" src={require('./assets/help_content.jpg')} alt="help content" onClick={() => setShowHelp(false)} />}
    </div>
  )
}

export default App
