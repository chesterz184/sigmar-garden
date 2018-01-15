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
			case 'vitae':
			case 'mors':
				this.type = 'set'
				break
		}
	}
}

export default Pinball