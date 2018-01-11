<template>
	<div id="app">
		<button @click="initGame">new game</button>
		<template v-for="circle in coords">
			<coord-item v-for="(item, index) in circle" :key="item.circle.toString() + index" :coord="item" @click-coord="onClickCoord(item)"></coord-item>
		</template>
	</div>
</template>

<script>
import Coord from './Coord'
import Pinball from './Pinball'
import CoordItem from './components/CoordItem'
import config from './config'

export default {
	name: 'app',
	components: {
		CoordItem
	},
	data() {
		return {
			metalList: ['lead', 'tin', 'iron', 'copper', 'silver', 'gold'],
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
			this.coords = this.createCoords()
			this.pinballList = this.createPinballs()

			this.coordsToPlace = this.generateCoordsArrange(this.coords)
			this.placePinballs(this.coordsToPlace, this.pinballList)

			this.metalList = ['lead', 'tin', 'iron', 'copper', 'silver', 'gold'],

				this.checkAllCoordsActive()

			this.testGame()
			// console.log(this.activeCoords)
			// console.log(this.coords)
		},
		//create a new coord Array
		createCoords: function () {
			let coords = []
			//center coord
			coords.push([new Coord(0, 0)])

			for (let i = 1; i < config.circles; i++) {
				let circleArr = []
				for (let j = 0; j < i * config.circles; j++) {
					circleArr.push(new Coord(i, j))
				}
				coords.push(circleArr)
			}

			coords.forEach(circle => {
				circle.forEach(coo => {
					coo.around = this.setCoordsAround(coo, coords)
				})
			})

			return coords
		},
		//create a randomized pinball array (gold at 0)
		createPinballs: function () {
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
		//generate a coords arrangement with rotational symmetry
		generateCoordsArrange: function (coords) {
			let a = [0, 3, 6],
				b = [0, 3, 6, 9, 12],
				c = [0, 3, 6, 9, 12, 15, 18],
				d = [0, 3, 6, 9, 12, 15, 18, 21, 24],
				e = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30]

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
			coords.forEach((circle, idx) => {
				if (randomedArrange[idx] !== 0) {
					let part = circle.length / 3,
						partCoords = randomedArrange[idx] / 3,
						flagArr = []
					for (let i = 0; i < part; i++) {
						flagArr[i] = i < partCoords ? 1 : 0
					}
					flagArr.shuffle()
					let arrangeArr = flagArr.concat(flagArr, flagArr)
					for (let i = 0; i < fullCounts[idx]; i++) {
						if (arrangeArr[i] === 1) {
							arrangedCoords.push(circle[i])
						}
					}
				}
			})
			// console.log('arrangedCoords: ', arrangedCoords)
			return arrangedCoords
		},
		//place pinballs on coords generated
		placePinballs: function (coords, balls) {
			let coordsLeft = this.coordsToPlace.slice()

			coords.forEach((coord, i) => {
				if (balls[i]) {
					// map.set(coord, balls[i])
					coord.placePinball(balls[i])
				} else {
					return
				}

			})

		},


		setCoordsAround: function (coord, coordList) {
			let {
					circle,
				index
				} = coord

			let result = []

			function coordsFix(coord) {
				if (coord.index < 0) {
					coord.index += (coord.circle * 6)
				} else if (coord.index >= coord.circle * 6) {
					coord.index -= (coord.circle * 6)
				}
				return coord
			}

			if (index === 0 && circle === 0) {
				// 0, 0
				result = [
					coordList[1][0],
					coordList[1][1],
					coordList[1][2],
					coordList[1][3],
					coordList[1][4],
					coordList[1][5]
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
				},].map(coordsFix)

				fixedIndex.forEach(e => {
					if (coordList[e.circle]) {
						result.push(coordList[e.circle][e.index])
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
				}].map(coordsFix)

				fixedIndex.forEach(e => {
					if (coordList[e.circle]) {
						result.push(coordList[e.circle][e.index])
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
		checkAllCoordsActive() {
			this.coords.forEach(circleArr => {
				circleArr.forEach(coord => {
					this.checkCoordActive(coord)
				})
			})
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
		//todo: test if the game can be solved
		testGame: function () {
			if (this.activeCoords.length > 9 || this.activeCoords.length < 5) {
				this.initGame()
			} else {
				if (!this.testActiveCoords(this.activeCoords)) {
					this.initGame()
				}
				this.coords.forEach(circle => {
					circle.forEach(c => {
						if (c.pinball && c.pinball.element === 'lead') {
							console.log('lead')
							let count = 0
							c.around.forEach(cc => {
								if (cc.pinball && this.metalList.indexOf(cc.pinball.element) > 0 || cc.pinball.element === 'quicksilver') {
									count++
								}
							})
							console.log('count', count)
							if (count > 2) {
								this.initGame()
							}
						}
					})
				})
			}
		},
		test: function () {
			if (!this.testActiveCoords(this.activeCoords)) {
				return false
			}
			let solvable = false
			let nodeArr = [].push(this.activeCoords.slice())
			let testedArr = []

			if (nodeArr[0].length === 0) {
				solvable = true
			} else {
				//todo
			}
		},
		testActiveCoords: function (activeCoords) {
			let result = false
			activeCoords.forEach((coo, idx, arr) => {
				for (let i = idx + 1; i < arr.length; i++) {
					if (this.match(coo.pinball, arr[i].pinball)) {
						result = true
					}
				}
			})
			return result
		},

		onClickCoord: function (coord) {
			if (coord.active && coord.pinball !== null) {
				//nothing selected
				if (this.selectedCoord === null) {
					//gold
					if (coord.pinball.element === 'gold') {
						coord.removePinball()
						this.checkAllCoordsActive()
						return
					}
					coord.selected = true
					this.selectedCoord = coord
				} else if (this.selectedCoord === coord) { //coord already selected
					this.selectedCoord.selected = false
					this.selectedCoord = null
				} else { //another coord selected
					if (this.match(this.selectedCoord.pinball, coord.pinball)) {
						this.selectedCoord.removePinball()
						coord.removePinball()

						this.selectedCoord = null
						this.checkAllCoordsActive()
					} else { //don't match
						this.selectedCoord.selected = false
						this.selectedCoord = null
					}
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
</style>