import Coord from './Coord'
import Pinball from './Pinball'
import config from './config'

class Game {
	constructor() {
		this.newGame()
	}

	newGame() {
		this.win = false
		this.selectedCoord = null
		this.activeCoords = []
		this.coords = createCoords()
		this.coordsToPlace = generateCoordsArrange(this.coords)
		placePinballs(this.coordsToPlace, createPinballs())
		this.metalList = this.getMetalList()
		this.checkAllCoordsActive()

		if (this.activeCoords.length > 9 || this.activeCoords.length < 5 || this.getMatchPairs().length === 0) {
			this.newGame()
		}
	}
	//selected coord
	set select(coord) {
		if (coord.active && coord.pinball !== null) {
			//nothing selected
			if (this.selectedCoord === null) {
				//gold
				if (coord.pinball.element === 'gold') {
					this.doMatch([coord])
					return
				}
				//not gold
				coord.selected = true
				this.selectedCoord = coord
			} else if (this.selectedCoord === coord) { //coord already selected
				this.selectedCoord.selected = false
				this.selectedCoord = null
			} else { //another coord selected
				if (match(this.selectedCoord.pinball, coord.pinball, this.metalList)) {
					this.doMatch([this.selectedCoord, coord])
				} else { //don't match
					this.selectedCoord.selected = false
					coord.selected = true
					this.selectedCoord = coord
				}
			}
		}
	}
	get select() {
		return this.selectedCoord
	}
	doMatch([aa, bb]) {
		let a = this.coords[aa.circle][aa.index],
			b = bb ? this.coords[bb.circle][bb.index] : null
		if (a.pinball.element === 'gold') {
			a.removePinball()
		} else {
			if (a.pinball.type === 'metal' || b.pinball.type === 'metal') {
				this.metalList.shift()
			}
			a.removePinball()
			b.removePinball()
			this.selectedCoord = null
		}
		this.win = this.checkAllCoordsActive().length === 0 ? true : false
	}
	checkAllCoordsActive() {
		let actives = []
		this.coords.forEach(circleArr => {
			circleArr.forEach(coord => {
				if (checkCoordActive(coord, this.coords, this.metalList)) {
					actives.push(coord)
				}
			})
		})
		this.activeCoords = actives
		return actives
	}
	getMetalList() {
		let quicksilverCount = 0
		this.coordsToPlace.forEach(coo => {
			if (coo.pinball && coo.pinball.element === 'quicksilver') {
				quicksilverCount--
			}
		})
		return ['lead', 'tin', 'iron', 'copper', 'silver', 'gold'].slice(quicksilverCount - 1)
	}
	getMatchPairs() {
		let result = []
		//gold
		this.activeCoords.forEach((coo, idx, arr) => {
			for (let i = idx + 1; i < arr.length; i++) {
				if (coo.pinball.element === 'gold') {
					result.push([{
						circle: coo.circle,
						index: coo.index
					}])
				}
			}
		})

		this.activeCoords.forEach((coo, idx, arr) => {
			for (let i = idx + 1; i < arr.length; i++) {
				if (coo.pinball.element === 'quicksilver' && match(coo.pinball, arr[i].pinball, this.metalList)) {
					result.push([{
						circle: coo.circle,
						index: coo.index
					}, {
						circle: arr[i].circle,
						index: arr[i].index
					}])
				}
			}
		})

		this.activeCoords.forEach((coo, idx, arr) => {
			for (let i = idx + 1; i < arr.length; i++) {
				if (coo.pinball.type === 'set' && match(coo.pinball, arr[i].pinball, this.metalList)) {
					result.push([{
						circle: coo.circle,
						index: coo.index
					}, {
						circle: arr[i].circle,
						index: arr[i].index
					}])
				}
			}
		})

		this.activeCoords.forEach((coo, idx, arr) => {
			for (let i = idx + 1; i < arr.length; i++) {
				if (coo.pinball.element === arr[i].pinball.element && match(coo.pinball, arr[i].pinball, this.metalList)) {
					result.push([{
						circle: coo.circle,
						index: coo.index
					}, {
						circle: arr[i].circle,
						index: arr[i].index
					}])
				}
			}
		})

		this.activeCoords.forEach((coo, idx, arr) => {
			for (let i = idx + 1; i < arr.length; i++) {
				if (coo.pinball.element === 'salt' && match(coo.pinball, arr[i].pinball, this.metalList)) {
					result.push([{
						circle: coo.circle,
						index: coo.index
					}, {
						circle: arr[i].circle,
						index: arr[i].index
					}])
				}
			}
		})
		// console.log('pairs', result)
		return result
	}



	static getAtomStatus(coords) {
		let result = {
			salt: {
				element: 'salt',
				count: 0,
				showCount: true,
				oddWarn: false
			},
			air: {
				element: 'air',
				count: 0,
				showCount: true,
				oddWarn: true
			},
			fire: {
				element: 'fire',
				count: 0,
				showCount: true,
				oddWarn: true
			},
			water: {
				element: 'water',
				count: 0,
				showCount: true,
				oddWarn: true
			},
			earth: {
				element: 'earth',
				count: 0,
				showCount: true,
				oddWarn: true
			},
			quicksilver: {
				element: 'quicksilver',
				count: 0,
				showCount: true,
				oddWarn: false
			},
			lead: {
				element: 'lead',
				count: 0,
				showCount: false,
				oddWarn: false
			},
			tin: {
				element: 'tin',
				count: 0,
				showCount: false,
				oddWarn: false
			},
			iron: {
				element: 'iron',
				count: 0,
				showCount: false,
				oddWarn: false
			},
			copper: {
				element: 'copper',
				count: 0,
				showCount: false,
				oddWarn: false
			},
			silver: {
				element: 'silver',
				count: 0,
				showCount: false,
				oddWarn: false
			},
			gold: {
				element: 'gold',
				count: 0,
				showCount: false,
				oddWarn: false
			},

			vitae: {
				element: 'vitae',
				count: 0,
				showCount: false,
				oddWarn: false
			},
			mors: {
				element: 'mors',
				count: 0,
				showCount: false,
				oddWarn: false
			},
		}
		coords.forEach(coo => {
			if (coo.pinball) {
				// console.log(coo.pinball.element)
				result[coo.pinball.element].count += 1
			}
		})
		return result
	}


	//todo
	solve() {
		console.log('solving. . .')
		let nodeStorage = [],
			pairStorage = [],
			matchPairs = [],
			startLayout = copyCoords(this.coords),
			checked = false

		nodeStorage.push({
			board: this.coords,
			pairs: this.getMatchPairs()
		})

		let step = 0
		// console.log(nodeStorage)
		let dfs = nodes => {
			console.log(step++)
			if (!checked && nodes.length > 0) {
				this.coords = copyCoords(nodes[0].board)
				this.checkAllCoordsActive()
				this.metalList = this.getMetalList()
				matchPairs = nodes[0].pairs
				if (matchPairs.length > 0) {
					if (pairStorage.indexOf(JSON.stringify(this.coords) + JSON.stringify(matchPairs)) === -1) {
						pairStorage.push(JSON.stringify(this.coords) + JSON.stringify(matchPairs))
						let pair = matchPairs.shift()
						this.doMatch(pair)
						if (this.win) {
							alert('has solution!')
							this.coords = startLayout
							checked = true
							return
						}
						if (this.getMatchPairs().length > 0) {
							nodes.unshift({
								board: copyCoords(this.coords),
								pairs: this.getMatchPairs()
							})
						}
					} else {
						console.log('aaaaa')
						nodes.shift()
					}
				} else {
					console.log('bbbbb')
					nodes.shift()
				}
				setTimeout(() => {
					dfs(nodes)
				}, 0)
			} else {
				alert('no solution!')
				this.coords = startLayout
				checked = true
			}
		}

		dfs(nodeStorage)


	}
}




export default Game


//create a new coord Array
function createCoords() {
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

	return coords
}
//create a randomized pinball array (gold at 0)
function createPinballs() {
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
}
//generate a coords arrangement with rotational symmetry
function generateCoordsArrange(coords) {
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
	// console.log('randomedArrange: ', randomedArrange)

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
}
//place pinballs on coords generated
function placePinballs(coords, balls) {
	coords.forEach((coord, i) => {
		if (balls[i]) {
			// map.set(coord, balls[i])
			coord.placePinball(balls[i])
		} else {
			return
		}
	})
}
function checkCoordActive(coord, coordList, metalList) {
	let {
		circle,
		index
	} = coord

	if (circle >= config.circles) {
		return true
	}
	if (coord.pinball === null) {
		return false
	}
	let result = false
	// if (coord.pinball) {
	let around = getCoordsAround(coord).map(coo => {
		if (coordList[coo.circle]) {
			return coordList[coo.circle][coo.index]
		} else {
			return new Coord(coo.circle, coo.index)
		}
	})
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

	if (coord.pinball && coord.pinball.type === 'metal' && coord.pinball.element !== metalList[0]) {
		// console.log('checkMetalActive: ', coord.pinball.element, this.metalList[0])
		result = false
	}

	// }
	coord.active = result

	return result
}
function getCoordsAround(coord) {
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
		result = [{
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

		result = [{
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

	} else {
		// edge
		// find left vertex
		let vertex = parseInt(index / circle)
		let diff = index - (vertex * circle)

		result = [{
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
	}
	// console.log(result)
	return result
}

// function test(coords) {

// 	if (this.activeCoords.length > 9 || this.activeCoords.length < 5) {
// 		this.newGame()
// 	} else if (this.getMatchPairs().length === 0) {
// 		this.newGame()
// 	} else {
// 		//protect lead // probably pointless
// 		this.coords.forEach(circle => {
// 			circle.forEach(c => {
// 				if (c.pinball && c.pinball.element === 'lead') {
// 					let count = 0,
// 						around = getCoordsAround(c)
// 					around.forEach(cc => {
// 						if (cc.circle < config.circles) {
// 							if (this.coords[cc.circle][cc.index].pinball && (this.coords[cc.circle][cc.index].pinball.type === 'metal' || this.coords[cc.circle][cc.index].pinball.element === 'quicksilver')) {
// 								count++
// 							}
// 						}
// 					})
// 					if (count > 2) {
// 						this.newGame()
// 					}
// 				}
// 			})
// 		})
// 	}
// }

function match(a, b, metalList) {
	switch (a.type) {
		case 'basic':
			if (b.type === 'basic' && a.element === b.element) {
				return true
			} else if (b.type === 'salt') {
				return true
			}
			break
		case 'quicksilver':
			if (b.element === metalList[0]) {
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
			if (a.element === metalList[0] && b.type === 'quicksilver') {
				return true
			}
			break
		default:
			return false
	}
	return false
}
//copy a coords array
function copyCoords(coords) {
	let result = []
	coords.forEach(circleArr => {
		let newCircleArr = []
		circleArr.forEach(coo => {
			let newCoord = new Coord(coo.circle, coo.index)
			newCoord.pinball = coo.pinball
			newCoord.active = coo.active
			newCircleArr.push(newCoord)
		})
		result.push(newCircleArr)
	})
	return result
}