import './public'
import { createCoords, checkCoordActive, generateCoordsArrange, copyCoord } from './Coord'
import { shuffleBalls, match } from './Pinball'

const metalOrder = {
  lead: 0,
  tin: 1,
  iron: 2,
  copper: 3,
  silver: 4,
  gold: 5,
}

export default class Game {
  constructor() {
    this.win = false
    this.$coords = createCoords()
    this.status = getInitStatus()
    this.$flatCoords = []
    this.$coords.forEach((circle) => {
      circle.forEach((index) => {
        index.setStatus(this.status)
        this.$flatCoords.push(index)
      })
    })
    this.$balls = []
    this.$metalList = []
    /* the coord being clicked/tapped */
    this.$selectedCoord = null
    /* the coords can be selected */
    this.$activeCoords = []
    /* for short, the initial layout of each game */
    this.$coordsToPlace = []
  }

  /* start a new game */
  initGame() {
    this.win = false
    this.$selectedCoord = null
    this.$activeCoords = []
    /* remove all pinballs */
    this._clearCoords()
    this.$coordsToPlace = generateCoordsArrange(this.$coords)
    // place the elements
    this.$balls = shuffleBalls()
    this.$metalList = []
    this.$coordsToPlace.forEach((coord, i) => {
      if (this.$balls[i]) {
        coord.placePinball(this.$balls[i])
        if (this.$balls[i].type === 'metal') {
          this.$metalList[metalOrder[this.$balls[i].element]] = coord
        }
      }
    })
    this._checkAllCoords()

    /* strange situations */
    if (this.$activeCoords.length > 9 || this.$activeCoords.length < 5 || this._getMatchPairs().length === 0) {
      this.initGame()
      return false
    }
    /* ensure metals and quicksilver don't appear 3 in a row */
    for (let i = 0; i < this.$metalList.length; i++) {
      let coord = this.$metalList[i],
        count = 0
      coord.around.forEach((coo) => {
        if (coo.pinball && (coo.pinball.type === 'metal' || coo.pinball.element === 'quicksilver')) {
          count++
        }
      })
      if (count > 1) {
        this.initGame()
        return false
      }
    }
    /* ensure there is a solution */
    if (!this.solve()) {
      this.initGame()
      return false
    }
    this.restart()
    return true
  }

  /* restart current game */
  restart() {
    this.win = false
    this.$selectedCoord = null
    this.$activeCoords = []
    /* remove all pinballs */
    this._clearCoords()
    // place the elements
    this.$metalList = []
    this.$coordsToPlace.forEach((coord, i) => {
      if (this.$balls[i]) {
        coord.placePinball(this.$balls[i])
        if (this.$balls[i].type === 'metal') {
          this.$metalList[metalOrder[this.$balls[i].element]] = coord
        }
      }
    })
    this._checkAllCoords()
  }

  /* select a coord on the board (by tap or click) */
  select(coord) {
    if (coord.active && coord.pinball !== null) {
      if (this.$selectedCoord === null) {
        //if nothing selected
        if (coord.pinball.element === 'gold') {
          this._doMatch([[coord.circle, coord.index]])
          return
        }
        coord.selected = true
        this.$selectedCoord = coord
      } else if (this.$selectedCoord === coord) {
        //coord already selected
        this.$selectedCoord.selected = false
        this.$selectedCoord = null
      } else {
        //another coord selected
        if (match(this.$selectedCoord.pinball, coord.pinball, this.$metalList)) {
          let a = this.$selectedCoord
          this._doMatch([
            [a.circle, a.index],
            [coord.circle, coord.index],
          ])
        } else {
          //don't match
          this.$selectedCoord.selected = false
          coord.selected = true
          this.$selectedCoord = coord
        }
      }
    }
  }

  static updateStatus(coords, status) {
    for (let ele in status) {
      status[ele].count = 0
    }
    coords.forEach((coo) => {
      if (coo.pinball) {
        status[coo.pinball.element].count += 1
      }
    })
  }

  static getInitStatus() {
    return getInitStatus()
  }

  getCoords() {
    return this.$coords
  }

  getFlatCoords() {
    return this.$flatCoords
  }

  getRenderCoords() {
    return this.$coordsToPlace
  }

  _doMatch(pair) {
    const [aa, bb] = pair
    let a = this.$coords[aa[0]][aa[1]],
      b = bb ? this.$coords[bb[0]][bb[1]] : null
    if (a.pinball.element === 'gold') {
      a.removePinball()
      this.$metalList.shift()
    } else {
      if (a.pinball.type === 'metal' || b.pinball.type === 'metal') {
        this.$metalList.shift()
      }
      a.removePinball()
      b.removePinball()
      this.$selectedCoord = null
    }
    this._checkAllCoords()
    this.win = this.$activeCoords.length === 0
  }

  _checkAllCoords() {
    let actives = []
    this.$coords.forEach((circleArr) => {
      circleArr.forEach((coord) => {
        if (checkCoordActive(coord, this.$metalList)) {
          actives.push(coord)
        }
      })
    })
    this.$activeCoords = actives
    return actives
  }
  // get an array of coord pairs that can be matched
  _getMatchPairs() {
    let result = []
    const arr = this.$activeCoords
    const len = arr.length
    arr.forEach((coo, idx) => {
      for (let i = idx + 1; i < len; i++) {
        if (coo.pinball.element === 'gold') {
          result.push([[coo.circle, coo.index]])
        } else if (match(coo.pinball, arr[i].pinball, this.$metalList)) {
          result.push([
            [coo.circle, coo.index],
            [arr[i].circle, arr[i].index],
          ])
        }
      }
    })
    return result
  }

  _clearCoords() {
    this.$coords.forEach((circle) => {
      circle.forEach((coo) => {
        coo.removePinball()
      })
    })
  }

  solve() {
    const moves = []
    const mem = {}
    let count = 0

    const dfs = (coords) => {
      count++
      if (count > 5000) {
        return false
      }
      let coordsHash = this._getCoordsHash(coords)
      if (mem[coordsHash]) {
        return mem[coordsHash]
      }
      let matchPairs = this._getMatchPairs()
      this._sortMatchPairs(matchPairs)
      if (matchPairs.length > 0) {
        /* pruning: analyze salt and element count */
        let oddCount = 0
        for (let ele in this.status) {
          let val = this.status[ele]
          if (val.oddWarn && val.count % 2 === 1) {
            oddCount++
          }
        }
        if (this.status['salt'].count < oddCount) {
          mem[coordsHash] = false
          return false
        }
        for (let pair of matchPairs) {
          let move = pair.map((coord) => {
            return copyCoord(this.$coords[coord[0]][coord[1]])
          })
          this._doMatch(pair)
          moves.push(move)
          if (this.win) {
            return true
          }
          if (dfs(this.$flatCoords)) {
            return true
          } else {
            mem[coordsHash] = false
            // back to last step
            let lastMove = moves.pop()
            lastMove.forEach((coo) => {
              let target = this.$coords[coo.circle][coo.index]
              target.placePinball(coo.pinball)
              if (coo.pinball.type === 'metal' && coo.pinball.element !== 'gold') {
                this.$metalList.unshift(target)
              }
            })
            this._checkAllCoords()
          }
        }
        mem[coordsHash] = false
        return false
      } else {
        mem[coordsHash] = false
        return false
      }
    }
    return dfs(this.$flatCoords)
  }

  /* a small approach of optimization */
  _sortMatchPairs(matchPairs) {
    matchPairs.sort((a, b) => {
      if (a.length === 1) {
        return -1
      }
      if (b.length === 1) {
        return 1
      }
      let aa = a.map((coo) => this.$coords[coo[0]][coo[1]])
      let bb = b.map((coo) => this.$coords[coo[0]][coo[1]])
      if (aa[0].pinball.type === 'metal' || aa[1].pinball.type === 'metal') {
        return -1
      } else if (bb[0].pinball.type === 'metal' || bb[1].pinball.type === 'metal') {
        return 1
      } else if (aa[0].pinball.type === 'set' || aa[1].pinball.type === 'set') {
        return -1
      } else if (bb[0].pinball.type === 'set' || bb[1].pinball.type === 'set') {
        return 1
      } else if (aa[0].pinball.element === aa[1].pinball.element) {
        return -1
      } else {
        return 1
      }
    })
  }

  _getCoordsHash(coords) {
    return coords
      .map((coo) => {
        if (coo.pinball) {
          return `${coo.circle}${coo.pinball ? coo.pinball.element.substring(0, 2) : 'n'}${coo.index}`
        } else {
          return ''
        }
      })
      .join('#')
  }
}

function getInitStatus() {
  return {
    salt: {
      element: 'salt',
      count: 0,
      showCount: true,
      oddWarn: false,
    },
    air: {
      element: 'air',
      count: 0,
      showCount: true,
      oddWarn: true,
    },
    fire: {
      element: 'fire',
      count: 0,
      showCount: true,
      oddWarn: true,
    },
    water: {
      element: 'water',
      count: 0,
      showCount: true,
      oddWarn: true,
    },
    earth: {
      element: 'earth',
      count: 0,
      showCount: true,
      oddWarn: true,
    },
    quicksilver: {
      element: 'quicksilver',
      count: 0,
      showCount: true,
      oddWarn: false,
    },
    lead: {
      element: 'lead',
      count: 0,
      showCount: false,
      oddWarn: false,
    },
    tin: {
      element: 'tin',
      count: 0,
      showCount: false,
      oddWarn: false,
    },
    iron: {
      element: 'iron',
      count: 0,
      showCount: false,
      oddWarn: false,
    },
    copper: {
      element: 'copper',
      count: 0,
      showCount: false,
      oddWarn: false,
    },
    silver: {
      element: 'silver',
      count: 0,
      showCount: false,
      oddWarn: false,
    },
    gold: {
      element: 'gold',
      count: 0,
      showCount: false,
      oddWarn: false,
    },

    vitae: {
      element: 'vitae',
      count: 0,
      showCount: false,
      oddWarn: false,
    },
    mors: {
      element: 'mors',
      count: 0,
      showCount: false,
      oddWarn: false,
    },
  }
}
