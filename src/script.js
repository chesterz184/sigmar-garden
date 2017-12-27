const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

let board = new Image()
board.src = './textures/board.png'
board.onload = function () {
	ctx.drawImage(board, 0, 0)
}

const config = {
	count: {
		air: 8,
		water: 8,
		fire: 8,
		earth: 8,
		lead: 1,
		tin: 1,
		iron: 1,
		copper: 1,
		silver: 1,
		gold: 1,
		quicksilver: 5, //metal - 1
		salt: 4,
		life: 4,
		death: 4
	},
	circles: 6
}

// class Atom {
// 	constructor(name) {
// 		this.name = name
// 	}
// }

class Pinball {
	constructor(element) {
		this.element = element
		switch (element) {
			case 'air':
			case 'water':
			case 'fire':
			case 'earth':
				this.type = 'basic'
				break
			case 'quicksilver':
				this.type = 'quicksilver'
				break
			case 'lead':
			case 'tin':
			case 'iron':
			case 'copper':
			case 'silver':
			case 'gold':
				this.type = 'metal'
				break
			case 'salt':
				this.type = 'salt'
				break
			case 'life':
			case 'death':
				this.type = 'set'
				break
		}

		//status
		this.alive = true //on board
	}

	remove() {
		this.alive = false
	}

}

class Coord {
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

}
class Game {
	constructor() {
		this.init()
	}

	init() {
		this.metalList = ['lead', 'tin', 'iron', 'copper', 'silver', 'gold']
		this.selected = []
		this.pinballList = this.initBalls()
		this.coords = this.initCoords()

		this.cpMap = this.initMap(this.coords, this.pinballList)
		this.checkAllCoordsActive()
		console.log(this.cpMap)

		this.remain = {
			air: config.count.air,
			water: config.count.water,
			fire: config.count.fire,
			earth: config.count.earth,
			quicksilver: config.count.quicksilver,
			life: config.count.life,
			death: config.count.death,
			salt: config.count.salt,
		}
	}

	initCoords() {
		let coords = []
		//middle coords
		coords.push([new Coord(0, 0)])

		for (let i = 1; i < config.circles; i++) {
			let circleArr = []
			for (let j = 0; j < i * 6; j++) {
				circleArr.push(new Coord(i, j))
			}
			coords.push(circleArr)
		}
		return coords
	}

	onTapCoords(coord) {
		if (this.cpMap.get(coord)) {

		}
	}

	initBalls() {
		let balls = []
		for (let ele in config.count) {
			for (let i = 0; i < config.count[ele]; i++) {
				balls.push(new Pinball(ele))
			}
		}
		return balls
	}

	initMap(coords, balls) {
		let map = new Map()
		// balls.forEach((ele, index) => {
		// 	map.set(coords[index], ele)
		// 	coords[index].pinball = ele
		// })
		let i = 0
		coords.forEach(circleArr => {
			circleArr.forEach(coord => {
				if (balls[i]) {
					map.set(coord, balls[i])
					coord.pinball = balls[i]
				} else {
					return
				}
				i++
			})
		})

		return map
	}
	
	getCoordsAround(coord) {
		let {
			circle,
			index
		} = coord

		let result = []

		if (index === 0 && circle === 0) {
			// 0, 0
			result =  [
				this.coords[1][0],
				this.coords[1][1],
				this.coords[1][2],
				this.coords[1][3],
				this.coords[1][4],
				this.coords[1][5]
			]
		} else if (index % circle === 0) {
			// vertex coord
			let vertex = index / circle
			
			let fixedIndex =  [{
				circle: circle + 1,
				index: index + vertex + 1
			}, {
				circle: circle,
				index: index + 1
			}, {
				circle: circle - 1,
				index: index - vertex
			}, {
				circle: circle,
				index: index - 1
			}, {
				circle: circle + 1,
				index: index + vertex - 1
			}, {
				circle: circle + 1,
				index: index + vertex
			}, ].map(this.coordsFix)

			fixedIndex.forEach(e => {
				result.push(this.coords[e.circle][e.index])
			})
		} else {
			// edge
			// find left vertex
			let vertex = parseInt(index / circle)
			let diff = index - (vertex * circle)

			let fixedIndex = [{
				circle: circle,
				index: index + 1
			}, {
				circle: circle - 1,
				index: (circle - 1) * vertex + diff
			}, {
				circle: circle - 1,
				index: (circle - 1) * vertex + diff - 1
			}, {
				circle: circle,
				index: index - 1
			}, {
				circle: circle + 1,
				index: (circle + 1) * vertex + diff
			}, {
				circle: circle + 1,
				index: (circle + 1) * vertex + diff + 1
			}].map(this.coordsFix)

			fixedIndex.forEach(e => {
				result.push(this.coords[e.circle][e.index])
			})
		}
		// console.log(result)
		return result
	}

	checkCoordActive(coord) {
		let {
			circle,
			index
		} = coord
		let result = false
		if (coord.pinball) {
			let around = this.getCoordsAround(coord)
			// console.log(around)
			around.forEach((c, i) => {
				if (i === 0) {
					if (c.pinball === null && around[5].pinball === null && around[1].pinball === null) {
						result = true
					}
				} else if (i === 5) {
					if (c.pinball === null && around[4].pinball === null && around[0].pinball === null ) {
						result = true
					}
				} else if (c.pinball === null && around[i - 1].pinball === null && around[i + 1].pinball === null) {
					result = true
				}
			})
		}
		coord.active = result
		// console.log(coord)
		return result
	}

	coordsFix(coord) {
		if (coord.index < 0) {
			coord.index += (coord.circle * 6)
		} else if (coord.index >= coord.circle * 6) {
			coord.index -= (coord.circle * 6)
		}
		return coord
	}

	checkAllCoordsActive() {
		this.coords.forEach(circleArr => {
			circleArr.forEach(coord => {
				this.checkCoordActive(coord)
			})
		})
	}

	match(a, b) {
		switch (a.type) {
			case 'basic':
				if (b.type === 'basic' && a.element === b.element) {
					return true
				} else if (b.type === 'salt') {
					return true
				}
				break
			case 'quicksilver':
				if (b.element === this.metalList[0]) {
					this.metalList.shift()
					return true
				}
				break
			case 'salt':
				if (b.type === 'basic' || b.type === 'salt') {
					return true
				}
				break
			case 'set':
				if (b.type === 'set' && a.element !== b.element) {
					return true
				}
				break
			case 'metal':
				if (a.element === this.metalList[0] && b.type === 'quicksilver') {
					this.metalList.shift()
					return true
				}
				break
			default:
				return false
		}
		return false
	}

	drawPinballs() {
		
	}
}

let test = new Game()