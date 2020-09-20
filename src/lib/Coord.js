import { copyPinball } from './Pinball'

const _circles = 6

export default class Coord {
  constructor(circle, index) {
    this.circle = circle
    this.index = index
    this.pinball = null
    this.active = false //can be selected
    this.selected = false
  }

  placePinball(pinball) {
    this.pinball = pinball
  }

  removePinball() {
    this.pinball = null
    this.active = false
    this.selected = false
  }
}

const _aroundCache = new Map()
function getCoordsAround(coord) {
  const { circle, index } = coord

	let arg = `${circle}-${index}`
  if (_aroundCache.has(arg)) {
    return _aroundCache.get(arg)
  }

  let result = []
  function coordsFix(coord) {
    if (coord.index < 0) {
      coord.index += coord.circle * 6
    } else if (coord.index >= coord.circle * 6) {
      coord.index -= coord.circle * 6
    }
    return coord
  }

  if (index === 0 && circle === 0) {
    // 0, 0
    result = [
      {
        circle: 1,
        index: 0,
      },
      {
        circle: 1,
        index: 1,
      },
      {
        circle: 1,
        index: 2,
      },
      {
        circle: 1,
        index: 3,
      },
      {
        circle: 1,
        index: 4,
      },
      {
        circle: 1,
        index: 5,
      },
    ]
  } else if (index % circle === 0) {
    // vertex coord
    let vertex = index / circle

    result = [
      {
        circle: circle + 1,
        index: index + vertex + 1,
      },
      {
        circle: circle,
        index: index + 1,
      },
      {
        circle: circle - 1,
        index: index - vertex,
      },
      {
        circle: circle,
        index: index - 1,
      },
      {
        circle: circle + 1,
        index: index + vertex - 1,
      },
      {
        circle: circle + 1,
        index: index + vertex,
      },
    ].map(coordsFix)
  } else {
    // edge
    // find left vertex
    let vertex = parseInt(index / circle)
    let diff = index - vertex * circle

    result = [
      {
        circle: circle,
        index: index + 1,
      },
      {
        circle: circle - 1,
        index: (circle - 1) * vertex + diff,
      },
      {
        circle: circle - 1,
        index: (circle - 1) * vertex + diff - 1,
      },
      {
        circle: circle,
        index: index - 1,
      },
      {
        circle: circle + 1,
        index: (circle + 1) * vertex + diff,
      },
      {
        circle: circle + 1,
        index: (circle + 1) * vertex + diff + 1,
      },
    ].map(coordsFix)
	}
	_aroundCache.set(arg, result)
  return result
}

export function checkCoordActive(coord, coordList, activeMetal) {
	if (coord.circle >= _circles) {
		return true
	}
  if (coord.pinball === null) {
    return false
  }
  let result = false
  let around = getCoordsAround(coord).map((coo) => {
    if (coordList[coo.circle]) {
      return coordList[coo.circle][coo.index]
    } else {
      return new Coord(coo.circle, coo.index)
    }
  })

  around.forEach((c, i) => {
    if (i === 0) {
      if (
        c.pinball === null &&
        around[5].pinball === null &&
        around[1].pinball === null
      ) {
        result = true
      }
    } else if (i === 5) {
      if (
        c.pinball === null &&
        around[4].pinball === null &&
        around[0].pinball === null
      ) {
        result = true
      }
    } else if (
      c.pinball === null &&
      around[i - 1].pinball === null &&
      around[i + 1].pinball === null
    ) {
      result = true
    }
  })

  if (
    coord.pinball &&
    coord.pinball.type === 'metal' &&
    coord.pinball.element !== activeMetal
  ) {
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