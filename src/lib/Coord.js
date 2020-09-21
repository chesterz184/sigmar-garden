import { copyPinball } from './Pinball'

const _circles = 6

export default class Coord {
  constructor(circle, index) {
    this.circle = circle
    this.index = index
    this.pinball = null
    this.active = false //can be selected
    this.selected = false
    /* the related status object */
    this.$status = null
    this.around = []
  }

  setStatus(status) {
    this.$status = status
  }

  placePinball(pinball) {
    this.pinball = pinball
    if (this.$status) {
      this.$status[pinball.element].count++
    }
  }

  removePinball() {
    if (this.pinball) {
      if (this.$status) {
        this.$status[this.pinball.element].count--
      }
      this.pinball = null
      this.active = false
      this.selected = false
    }
  }
}

function getCoordsAround(coord) {
  const { circle, index } = coord
  let result = []
  function coordsFix(coord) {
    if (coord[1] < 0) {
      coord[1] += coord[0] * 6
    } else if (coord[1] >= coord[0] * 6) {
      coord[1] -= coord[0] * 6
    }
    return coord
  }

  if (index === 0 && circle === 0) {
    // 0, 0
    result = [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
    ]
  } else if (index % circle === 0) {
    // vertex coord
    let vertex = index / circle
    result = [
      [circle + 1, index + vertex + 1],
      [circle, index + 1],
      [circle - 1, index - vertex],
      [circle, index - 1],
      [circle + 1, index + vertex - 1],
      [circle + 1, index + vertex],
    ].map(coordsFix)
  } else {
    // edge
    // find left vertex
    let vertex = parseInt(index / circle)
    let diff = index - vertex * circle

    result = [
      [circle, index + 1],
      [circle - 1, (circle - 1) * vertex + diff],
      [circle - 1, (circle - 1) * vertex + diff - 1],
      [circle, index - 1],
      [circle + 1, (circle + 1) * vertex + diff],
      [circle + 1, (circle + 1) * vertex + diff + 1]
    ].map(coordsFix)
  }
  return result
}

export function checkCoordActive(coord, metalList) {
  const activeMetal = metalList[0] ? metalList[0].pinball.element : ''
  if (coord.circle >= _circles) {
    return true
  }
  if (coord.pinball === null) {
    return false
  }
  let result = false
  const around = coord.around
  coord.around.forEach((c, i) => {
    if (i === 0) {
      if (c.pinball === null && around[5].pinball === null && around[1].pinball === null) {
        result = true
      }
    } else if (i === 5) {
      if (c.pinball === null && around[4].pinball === null && around[0].pinball === null) {
        result = true
      }
    } else if (c.pinball === null && around[i - 1].pinball === null && around[i + 1].pinball === null) {
      result = true
    }
  })

  if (coord.pinball && coord.pinball.type === 'metal' && coord.pinball.element !== activeMetal) {
    result = false
  }

  coord.active = result

  return result
}
//create a new coord Array
export function createCoords() {
  let coords = []
  //center coord
  coords.push([new Coord(0, 0)])

  for (let i = 1; i < _circles; i++) {
    let circleArr = []
    for (let j = 0; j < i * _circles; j++) {
      circleArr.push(new Coord(i, j))
    }
    coords.push(circleArr)
  }

  /* save around coords */
  coords.forEach(circle => {
    circle.forEach(index => {
      index.around = getCoordsAround(index).map(coo => {
        const [c, i] = coo
        return coords[c] ? coords[c][i] : new Coord(c, i)
      })
    })
  })

  return coords
}

function getCountsForEachCircle() {
  let a = [0, 3, 6],
    b = [0, 3, 6, 9, 12],
    c = [0, 3, 6, 9, 12, 15, 18],
    d = [0, 3, 6, 9, 12, 15, 18, 21, 24],
    e = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30]

  let res = []

  a.forEach((aa) => {
    b.forEach((bb) => {
      c.forEach((cc) => {
        d.forEach((dd) => {
          e.forEach((ee) => {
            if (aa + bb + cc + dd + ee === 54) {
              res.push([1, aa, bb, cc, dd, ee])
            }
          })
        })
      })
    })
  })
  return res
}
//generate a coords arrangement with rotational symmetry
let _arrangements = null
export function generateCoordsArrange(coords) {
  const arrangements = _arrangements || getCountsForEachCircle()
  _arrangements = arrangements

  const range = arrangements.length
  let arrangement = arrangements[parseInt(Math.random() * range, 10)]
  let arrangedCoords = []
  coords.forEach((circle, idx) => {
    if (arrangement[idx] !== 0) {
      let part = circle.length / 3,
        partCoords = arrangement[idx] / 3,
        flagArr = []
      for (let i = 0; i < part; i++) {
        flagArr[i] = i < partCoords ? 1 : 0
      }
      flagArr.shuffle()
      for (let i = 0; i < circle.length; i++) {
        if (flagArr[i % part] === 1) {
          arrangedCoords.push(circle[i])
        }
      }
    }
  })
  return arrangedCoords
}

export function copyCoord(coord) {
  let res = new Coord(coord.circle, coord.index)
  res.pinball = copyPinball(coord.pinball)
  res.active = coord.active
  res.selected = coord.selected
  return res
}
