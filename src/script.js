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

	//todo 
	getCoordsAround() {
		let circle = this.circle
		let index = this.index

		if (index === 0 && circle === 0) {
			// 0, 0
			return [{
					circle: 1,
					index: 0
				},
				{
					circle: 1,
					index: 1
				},
				{
					circle: 1,
					index: 2
				},
				{
					circle: 1,
					index: 3
				},
				{
					circle: 1,
					index: 4
				},
				{
					circle: 1,
					index: 5
				},
			]
		} else if (index % circle === 0) {
			// vertex coord
			let vertex = index / circle
			return [{
				circle: circle - 1,
				index: index - vertex
			}, {
				circle: circle + 1,
				index: index + vertex
			}, {
				circle: circle,
				index: index + 1
			}, {
				circle: circle,
				index: index - 1
			}, {
				circle: circle + 1,
				index: index + vertex + 1
			}, {
				circle: circle + 1,
				index: index + vertex - 1
			}].map(this.coordsFix)
		} else {
			// edge
			// find left vertex
			let vertex = parseInt(index / circle)
			let diff = index - (vertex * circle)

			return [{
				circle: circle,
				index: index + 1
			}, {
				circle: circle,
				index: index - 1
			}, {
				circle: circle - 1,
				index: (circle - 1) * vertex + diff
			}, {
				circle: circle - 1,
				index: (circle - 1) * vertex + diff - 1
			}, {
				circle: circle + 1,
				index: (circle + 1) * vertex + diff
			}, {
				circle: circle + 1,
				index: (circle + 1) * vertex + diff + 1
			}].map(this.coordsFix)
		}
	}

	isActive() {
		let result = false
		if (this.pinball) {
			let around = this.getCoordsAround()
			around.forEach((coord, index) => {
				if (index === 0) {
					if (coord.pinball && around[5].pinball && around[1].pinball) {
						result = true
					}
				} else if (index === 5) {
					if (coord.pinball && around[4].pinball && around[0].pinball) {
						result = true
					}
				} else if (coord.pinball && around[index - 1].pinball && around[index + 1].pinball) {
					result = true
				}
			})
		}
		return result
	}

	coordsFix(coord) {
		let {
			circle,
			index
		} = coord
		if (index < 0) {
			index += (circle * 6)
		} else if (index >= circle * 6) {
			index -= (circle * 6)
		}
		return {
			circle: circle,
			index: index
		}
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
		coords.push({
			circle: 0,
			index: 0
		})

		for (let i = 0; i < config.circles; i++) {
			for (let j = 0; j < i * 6; j++) {
				coords.push({
					circle: i,
					index: j
				})
			}
		}
		// console.log(coords)
		return coords
	}

	onTapCoords(coord) {
		if (this.cpMap.get(coord)) {

		}
	}

	// checkCoordActive(coord) {

	// }

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
		balls.forEach((ele, index) => {
			map.set(coords[index], ele)
		})
		return map
	}

	matchCheck(a, b) {
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
}

let test = new Game()