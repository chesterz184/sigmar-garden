import './public'
import { createCoords, checkCoordActive, generateCoordsArrange } from './Coord'
import { shuffleBalls,  match } from './Pinball'

export default class Game {
  constructor() {
    this.win = false
    this.$coords = createCoords()
    this.$flatCoords = []
    this.$coords.forEach(circle => {
      circle.forEach(index => {
        this.$flatCoords.push(index)
      })
    })
    this.$selectedCoord = null
    this.$activeCoords = []
    this.$coordsToPlace = []
  }

  /* start a new game */
  initGame() {
    this.win = false
    this.$selectedCoord = null
    // coords can be selected
    this._clearCoords()
    this.$activeCoords = []
    this.$coordsToPlace = generateCoordsArrange(this.$coords)
    // place the elements
    let balls = shuffleBalls()
    this.$coordsToPlace.forEach((coord, i) => {
      if (balls[i]) {
        coord.placePinball(balls[i])
      }
    })
    this.$metalList = ['lead', 'tin', 'iron', 'copper', 'silver', 'gold']
    this._checkAllCoords()

    if (
      this.$activeCoords.length > 9 ||
      this.$activeCoords.length < 5 ||
      this._getMatchPairs().length === 0
    ) {
      this.initGame()
    }
  }

  /* select a coord on the board (by tap or click) */
  select(coord) {
    if (coord.active && coord.pinball !== null) {
      if (this.$selectedCoord === null) {
        //if nothing selected
        if (coord.pinball.element === 'gold') {
          this._doMatch([coord])
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
        if (
          match(this.$selectedCoord.pinball, coord.pinball, this.$metalList[0])
        ) {
          this._doMatch([this.$selectedCoord, coord])
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
    for(let ele in status) {
      status[ele].count = 0
    }
    coords.forEach((coo) => {
      if (coo.pinball) {
        status[coo.pinball.element].count += 1
      }
    })
  }

  static getInitStatus() {
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

  getCoords() {
    return this.$coords
  }

  getFlatCoords() {
    return this.$flatCoords
  }

  _doMatch(pair) {
    const [aa, bb] = pair
    let a = this.$coords[aa.circle][aa.index],
      b = bb ? this.$coords[bb.circle][bb.index] : null
    if (a.pinball.element === 'gold') {
      a.removePinball()
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
        if (checkCoordActive(coord, this.$coords, this.$metalList[0])) {
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
          result.push([
            {
              circle: coo.circle,
              index: coo.index,
            },
          ])
        } else if (match(coo.pinball, arr[i].pinball, this.$metalList[0])) {
          result.push([
            {
              circle: coo.circle,
              index: coo.index,
            },
            {
              circle: arr[i].circle,
              index: arr[i].index,
            },
          ])
        }
      }
    })
    return result
  }

  _clearCoords() {
    this.$coords.forEach(circle => {
      circle.forEach(coo => {
        coo.removePinball()
      })
    })
  }

  // _getMetalList() {
  //   let quicksilverCount = 0
  //   this.$coordsToPlace.forEach((coo) => {
  //     if (coo.pinball && coo.pinball.element === 'quicksilver') {
  //       quicksilverCount++
  //     }
  //   })
  //   return ['lead', 'tin', 'iron', 'copper', 'silver', 'gold'].slice(
  //     quicksilverCount - 1
  //   )
  // }
}
