<template>
	<div id="app">
		<button @click="initGame">new game</button>
		<template v-for="circle in coords">
			<coord-item v-for="(item, index) in circle" :coord="item" @click-coord="onClickCoord(item)"></coord-item>
		</template>
	</div>
</template>

<script>
import Coord from './Coord'
import Pinball from './Pinball'
import CoordItem from './components/CoordItem'
import config from './config'

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

export default {
	name: 'app',
	components: {
		CoordItem
	},
	data() {
		return {
			// metalList: [],
			metalList: ['lead', 'tin', 'iron', 'copper', 'silver', 'gold'],
			metalSeq: ['silver', 'copper', 'iron', 'tin', 'lead'],
			ballsRandomizeSeq: ['air', 'air', 'air', 'air', 'water', 'water', 'water', 'water', 'metal', 'metal', 'metal', 'metal', 'metal', 'salt', 'salt', 'salt', 'salt', 'ld', 'ld', 'ld', 'ld'],
			pinballList: [],
			coords: [],
			coordsToPlace: [],
			selectedCoord: null
		}
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
		this.initGame()
	},
	methods: {
		initGame: function () {
			this.initCoords()
			this.pinballList = this.initBalls()

			this.coordsToPlace = this.generateCoordsArrange()
			this.placePinballs(this.coordsToPlace, this.pinballList)

			this.checkAllCoordsActive()

			this.testGame()
			// console.log(this.activeCoords)
			// console.log(this.coords)
		},
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
			// balls[0] is gold
			balls.shuffle().unshift(new Pinball('gold'))

			return balls
		},
		generateCoordsArrange: function () {
			// let a = [2, 3, 6],
			// 	b = [2, 3, 4, 6, 12],
			// 	c = [2, 3, 6, 9, 18],
			// 	d = [2, 3, 4, 6, 8, 12, 24],
			// 	e = [2, 3, 5, 6, 10, 15, 30]

			let a = [0, 3, 6],
				b = [3, 6, 12],
				c = [3, 6, 9, 18],
				d = [3, 6, 12, 24],
				e = [3, 6, 15, 30]

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
			console.log('randomedArrange: ', randomedArrange)

			let arrangedCoords = []
			this.coords.forEach((circle, idx) => {
				if (randomedArrange[idx] !== 0) {
					for (let i = 0; i < fullCounts[idx]; i += (fullCounts[idx] / randomedArrange[idx])) {
						arrangedCoords.push(circle[i])
					}
				}
			})
			// console.log('arrangedCoords: ', arrangedCoords)
			return arrangedCoords
		},
		placePinballs: function (coords, balls) {
			let coordsLeft = this.coordsToPlace.slice()
			//place gold
			// coordsLeft[0].placePinball(new Pinball('gold'))
			// coordsLeft.shift()
			// this.metalList.push('gold')

			//place other pinballs
			let ballsRandomizeSeq = this.ballsRandomizeSeq.shuffle()
			let self = this
			//useless
			function place() {
				if (ballsRandomizeSeq.length > 0) {
					console.log(ballsRandomizeSeq)
					let rPos1, rPos2
					let ele = ballsRandomizeSeq[0]
					switch (ele) {
						case 'air':
						case 'water':
						case 'fire':
						case 'earth':
							rPos1 = parseInt(Math.random() * coordsLeft.length, 10)
							rPos2 = parseInt(Math.random() * coordsLeft.length, 10)
							if (rPos1 !== rPos2) {
								if (coordsLeft[rPos1].active) {
									coordsLeft[rPos1].placePinball(new Pinball(ele))
									self.checkSelfAroundCoordActive(coordsLeft[rPos1])
									if (coordsLeft[rPos2].active) {
										//place success
										coordsLeft[rPos2].placePinball(new Pinball(ele))
										self.checkSelfAroundCoordActive(coordsLeft[rPos2])
										coordsLeft.splice(rPos1, 1)
										coordsLeft.splice(rPos2, 1)
										ballsRandomizeSeq.shift()
									} else {
										//rPos2 isn't active
										coordsLeft[rPos1].removePinball()
									}
								}
							}
							break
						case 'ld':
							rPos1 = parseInt(Math.random() * coordsLeft.length, 10)
							rPos2 = parseInt(Math.random() * coordsLeft.length, 10)
							if (rPos1 !== rPos2) {
								if (coordsLeft[rPos1].active) {
									coordsLeft[rPos1].placePinball(new Pinball('life'))
									self.checkSelfAroundCoordActive(coordsLeft[rPos1])
									if (coordsLeft[rPos2].active) {
										//place success
										coordsLeft[rPos2].placePinball(new Pinball('death'))
										self.checkSelfAroundCoordActive(coordsLeft[rPos2])
										coordsLeft.splice(rPos1, 1)
										coordsLeft.splice(rPos2, 1)
										ballsRandomizeSeq.shift()
									} else {
										//rPos2 isn't active
										coordsLeft[rPos1].removePinball()
									}
								}
							}
							break
						case 'salt':
							rPos1 = parseInt(Math.random() * coordsLeft.length, 10)
							if (coordsLeft[rPos1].active) {
								coordsLeft[rPos1].placePinball(new Pinball(ele))
								self.checkSelfAroundCoordActive(coordsLeft[rPos1])
								coordsLeft.splice(rPos1, 1)
								ballsRandomizeSeq.shift()
							}
							break
						case 'metal':
							rPos1 = parseInt(Math.random() * coordsLeft.length, 10)
							rPos2 = parseInt(Math.random() * coordsLeft.length, 10)
							if (rPos1 !== rPos2) {
								if (coordsLeft[rPos1].active) {
									coordsLeft[rPos1].placePinball(new Pinball('quicksilver'))
									self.checkSelfAroundCoordActive(coordsLeft[rPos1])
									if (coordsLeft[rPos2].active) {
										//place success
										// console.log(self.metalSeq)
										let metal = self.metalSeq.shift()
										self.metalList.unshift(metal)
										// console.log('metalList: ', self.metalList)
										coordsLeft[rPos2].placePinball(new Pinball(metal))

										self.checkSelfAroundCoordActive(coordsLeft[rPos2])

										coordsLeft.splice(rPos1, 1)
										coordsLeft.splice(rPos2, 1)
										ballsRandomizeSeq.shift()

									} else {
										//rPos2 isn't active
										coordsLeft[rPos1].removePinball()
									}
								}
							}
							break
					}
					place()
				}
			}






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

			if (circle >= config.circles) {
				return
			}
			let result = false
			// if (coord.pinball) {
			let around = coord.around
			// console.log('coordToCheck', coord)
			// console.log('around', around)
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
				// console.log('checkMetalActive: ', coord.pinball.element, this.metalList[0])
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
			if (this.activeCoords.length > 8 || this.activeCoords.length < 6) {
				this.initGame()
			} else {
				console.log('test')
				let ok = false
				this.activeCoords.forEach((coo, idx, arr) => {
					for (let i = idx + 1; i < arr.length; i++) {
						if (this.match(coo.pinball, arr[i].pinball)) {
							ok = true
						}
					}
				})
				if (!ok) {
					this.initGame()
				}
			}
		},

	}
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  /* background: url('./textures/background_4.png') no-repeat; */
}

#app {
  position: relative;
}

.coord-item {
  position: absolute;

  top: 50vh;
  left: 50vw;
}

.coord-item.active {
  background: #333;
  color: #ddd;
}

.coord-item.selected {
  color: #777;
  background: grey;
}
</style>