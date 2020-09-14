const _elementCount = {
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
  vitae: 4,
  mors: 4,
}

export default class Pinball {
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

//create a randomized pinball array (gold at 0)
let _balls = null
export function shuffleBalls() {
  if (!_balls) {
    _balls = []
    for (let ele in _elementCount) {
      for (let i = 0; i < _elementCount[ele]; i++) {
        if (ele !== 'gold') {
          _balls.push(new Pinball(ele))
        }
      }
    }
  }
  // _balls[0] is gold
  _balls.shuffle().unshift(new Pinball('gold'))
  return _balls
}

export function match(a, b, activeMetal) {
  switch (a.type) {
    case 'basic':
      if (b.type === 'basic' && a.element === b.element) {
        return true
      } else if (b.type === 'salt') {
        return true
      }
      break
    case 'quicksilver':
      if (b.element === activeMetal) {
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
      if (a.element === activeMetal && b.type === 'quicksilver') {
        return true
      }
      break
    default:
      return false
  }
  return false
}