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

export default Coord