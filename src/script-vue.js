class Coord {
	constructor(circle, index) {
		this.circle = circle
		this.index = index
		this.pinball = null
		this.active = true //can be selected
		this.selected = false
	}

	placePinball(pinball) {
		this.pinball = pinball
	}

	removePinball() {
		this.pinball = null
		// this.active = false
		this.selected = false
	}
}

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
	}
}

//shuffle Array
Array.prototype.shuffle = function () {
	var input = this

	for (let i = input.length - 1; i >= 0; i--) {

		let randomIndex = Math.floor(Math.random() * (i + 1))
		let itemAtIndex = input[randomIndex]

		input[randomIndex] = input[i]
		input[i] = itemAtIndex
	}
	return input
}

const config = {
	hexRadius: 40,
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


var app = new Vue({
	el: '#app',
	data: {
		metalList: ['lead', 'tin', 'iron', 'copper', 'silver', 'gold'],
		// metalList: [],
		ballsRandomizeSeq: ['air', 'air', 'air', 'air', 'water', 'water', 'water', 'water', 'metal', 'metal', 'metal', 'metal', 'metal', 'salt', 'salt', 'salt', 'salt', 'ld', 'ld', 'ld', 'ld'],
		pinballList: [],
		coords: [],
		coordsToPlace: [],
		selectedCoord: null

	},
	computed: {
		activeCoords: function () {
			let activeCoords = []
			this.coordsToPlace.forEach(c => {
				if (c.active) {
					activeCoords.push(c)
				}
			})
			return activeCoords
		}
	},
	mounted: function () {
		this.initCoords()
		this.initBalls()

		this.coordsToPlace = this.generateCoordsArrange()
		this.placePinballs(this.coordsToPlace, this.pinballList)
		
		this.checkAllCoordsActive()

		console.log(this.activeCoords)


		// console.log(this.coords)
	},
	methods: {
		initCoords: function () {
			let coords = []
			//middle coords
			coords.push([new Coord(0, 0)])

			for (let i = 1; i < config.circles; i++) {
				let circleArr = []
				for (let j = 0; j < i * config.circles; j++) {
					circleArr.push(new Coord(i, j))
				}
				coords.push(circleArr)
			}
			this.coords = coords
			this.coords.forEach(circle => {
				circle.forEach(coo => {
					coo.around = this.setCoordsAround(coo)
				})
			})

			return coords
		},
		initBalls: function () {
			let balls = []

			for (let ele in config.count) {
				for (let i = 0; i < config.count[ele]; i++) {
					if (ele !== 'gold') {
						balls.push(new Pinball(ele))
					}
				}
			}
			balls.shuffle().unshift(new Pinball('gold'))
			this.pinballList = balls
			return balls
		},
		generateCoordsArrange: function () {
			let a = [2, 3, 6],
				b = [2, 3, 4, 6, 12],
				c = [2, 3, 6, 9, 18],
				d = [2, 3, 4, 6, 8, 12, 24],
				e = [2, 3, 5, 6, 10, 15, 30]

			let countsForEachCircle = [],
				fullCounts = [1, 6, 12, 18, 24, 30]

			a.forEach(aa => {
				b.forEach(bb => {
					c.forEach(cc => {
						d.forEach(dd => {
							e.forEach(ee => {
								if (aa + bb + cc + dd + ee === 54) {
									countsForEachCircle.push([1, aa, bb, cc, dd, ee])
								}
							})
						})
					})
				})
			})
			let range = countsForEachCircle.length
			let randomedArrange = countsForEachCircle[parseInt(Math.random() * range, 10)]
			console.log(randomedArrange)

			let arrangedCoords = []
			this.coords.forEach((circle, idx) => {
				if (randomedArrange[idx] !== 0) {
					for (let i = 0; i < fullCounts[idx]; i += (fullCounts[idx] / randomedArrange[idx])) {
						arrangedCoords.push(circle[i])
					}
				}
			})
			console.log(arrangedCoords)
			return arrangedCoords
		},
		placePinballs: function (coords, balls) {
			let coordsLeft = this.coordsToPlace.slice(0)
			//place gold
			this.metalList.push('gold')
			coords[0].placePinball(new Pinball('gold'))
			coordsLeft.shift()

			//place other pinballs
			// let ballsRandomizeSeq = this.ballsRandomizeSeq.shuffle()
			// ballsRandomizeSeq.forEach(ele => {
			// 	switch (ele) {
			// 		case 'air':
			// 		case 'water':
			// 		case 'fire':
			// 		case 'earth':
			// 			let randomizedPos1 = coordsLeft[parseInt(Math.random() * coordsLeft.length, 10)]
			// 	}
			// })





			// let map = new Map()

			coords.forEach((coord, i) => {
				if (balls[i]) {
					// map.set(coord, balls[i])
					coord.placePinball(balls[i])
				} else {
					return
				}

			})


			// return map
		},
		setCoordsAround: function (coord) {
			let {
				circle,
				index
			} = coord

			let result = []

			if (index === 0 && circle === 0) {
				// 0, 0
				result = [
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

				let fixedIndex = [{
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
				},].map(this.coordsFix)

				fixedIndex.forEach(e => {
					if (this.coords[e.circle]) {
						result.push(this.coords[e.circle][e.index])
					} else {
						result.push(new Coord(e.circle, e.index))
					}

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
					if (this.coords[e.circle]) {
						result.push(this.coords[e.circle][e.index])
					} else {
						result.push(new Coord(e.circle, e.index))
					}
				})
			}
			// console.log(result)
			return result
		},
		checkCoordActive: function (coord) {
			let {
				circle,
				index
			} = coord
			let result = false
			// if (coord.pinball) {
			let around = coord.around
			// console.log(around)
			around.forEach((c, i) => {
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

			if (coord.pinball && coord.pinball.type === 'metal' && coord.pinball.element !== this.metalList[0]) {
				result = false
			}
			// }
			coord.active = result

			return result
		},
		checkSelfAroundCoordActive: function (coord) {
			this.checkCoordActive(coord)
			coord.around.forEach(c => {
				this.checkCoordActive(c)
			})
		},
		checkAllCoordsActive() {
			this.coords.forEach(circleArr => {
				circleArr.forEach(coord => {
					this.checkCoordActive(coord)
				})
			})
		},
		coordsFix: function (coord) {
			if (coord.index < 0) {
				coord.index += (coord.circle * 6)
			} else if (coord.index >= coord.circle * 6) {
				coord.index -= (coord.circle * 6)
			}
			return coord
		},
		onClickCoord: function (coord) {
			if (coord.active && coord.pinball !== null) {
				if (this.selectedCoord === null) {
					//gold
					if (coord.pinball.element === 'gold') {
						coord.removePinball()
						this.checkAllCoordsActive()
						return
					}
					coord.selected = true
					this.selectedCoord = coord
				} else if (this.selectedCoord === coord) {
					this.selectedCoord.selected = false
					this.selectedCoord = null
				} else {
					if (this.match(this.selectedCoord.pinball, coord.pinball)) {
						this.selectedCoord.removePinball()
						coord.removePinball()
						this.selectedCoord = null

						this.checkAllCoordsActive()
					} else {
						this.selectedCoord.selected = false
						this.selectedCoord = null
					}
				}
			}
		},
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
		},

		testGame: function () {

		},

	}
})

Vue.component('coord-item', {
	template: '<div @click="onClick" class="coord-item" :class="{active: coord.active && coord.pinball, selected: coord.selected}" :style="\'transform: translate(\' + transX + \'px, \' + transY + \'px)\'">{{coord.pinball ? coord.pinball.element : \'null\'}}</div>',
	props: ['coord'],
	computed: {
		transX: function () {
			let { circle, index } = this.coord
			if (index === 0 && circle === 0) {
				// 0, 0
				return 0
			} else if (index % circle === 0) {
				// vertex coord
				let vertex = index / circle
				switch (vertex) {
					case 0:
						return circle * config.hexRadius * Math.sqrt(3)
					case 1:
					case 5:
						return circle * config.hexRadius * Math.sqrt(3) / 2
					case 2:
					case 4:
						return circle * config.hexRadius * Math.sqrt(3) / (-2)
					case 3:
						return circle * config.hexRadius * Math.sqrt(3) * (-1)
				}
			} else {
				// edge
				// find left vertex
				let vertex = parseInt(index / circle)
				let diff = index - (vertex * circle)

				switch (vertex) {
					case 0:
						return circle * config.hexRadius * Math.sqrt(3) - (config.hexRadius * diff * Math.sqrt(3) / 2)
					case 1:
						return circle * config.hexRadius * Math.sqrt(3) / 2 - (config.hexRadius * diff * Math.sqrt(3))
					case 2:
						return circle * config.hexRadius * Math.sqrt(3) / (-2) - (config.hexRadius * diff * Math.sqrt(3) / 2)
					case 3:
						return circle * config.hexRadius * Math.sqrt(3) * (-1) + (config.hexRadius * diff * Math.sqrt(3) / 2)
					case 4:
						return circle * config.hexRadius * Math.sqrt(3) / (-2) + (config.hexRadius * diff * Math.sqrt(3))
					case 5:
						return circle * config.hexRadius * Math.sqrt(3) / 2 + (config.hexRadius * diff * Math.sqrt(3) / 2)
				}
			}
		},
		transY: function () {
			let { circle, index } = this.coord
			if (index === 0 && circle === 0) {
				// 0, 0
				return 0
			} else if (index % circle === 0) {
				// vertex coord
				let vertex = index / circle
				switch (vertex) {
					case 0:
					case 3:
						return 0
					case 1:
					case 2:
						return circle * config.hexRadius * -1.5
					case 4:
					case 5:
						return circle * config.hexRadius * 1.5
				}
			} else {
				// edge
				// find left vertex
				let vertex = parseInt(index / circle)
				let diff = index - (vertex * circle)

				switch (vertex) {
					case 0:
						return 0 - diff * config.hexRadius * 1.5
					case 1:
						return circle * config.hexRadius * -1.5
					case 2:
						return circle * config.hexRadius * -1.5 + diff * config.hexRadius * 1.5
					case 3:
						return 0 + diff * config.hexRadius * 1.5
					case 4:
						return circle * config.hexRadius * 1.5
					case 5:
						return circle * config.hexRadius * 1.5 - diff * config.hexRadius * 1.5
				}
			}
		}
	},

	mounted: function () {

	},
	methods: {
		onClick: function () {

			this.$emit('click-coord')
		}
	}
})