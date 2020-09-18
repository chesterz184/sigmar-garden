export const getTransX = (circle, index, radius) => {
  if (index === 0 && circle === 0) {
    // 0, 0
    return 0
  } else if (index % circle === 0) {
    // vertex coord
    let vertex = index / circle
    switch (vertex) {
      case 0:
        return circle * radius * Math.sqrt(3)
      case 1:
      case 5:
        return (circle * radius * Math.sqrt(3)) / 2
      case 2:
      case 4:
        return (circle * radius * Math.sqrt(3)) / -2
      case 3:
        return circle * radius * Math.sqrt(3) * -1
      default:
        return 0
    }
  } else {
    // edge
    // find left vertex
    let vertex = parseInt(index / circle)
    let diff = index - vertex * circle
    switch (vertex) {
      case 0:
        return circle * radius * Math.sqrt(3) - (radius * diff * Math.sqrt(3)) / 2
      case 1:
        return (circle * radius * Math.sqrt(3)) / 2 - radius * diff * Math.sqrt(3)
      case 2:
        return (circle * radius * Math.sqrt(3)) / -2 - (radius * diff * Math.sqrt(3)) / 2
      case 3:
        return circle * radius * Math.sqrt(3) * -1 + (radius * diff * Math.sqrt(3)) / 2
      case 4:
        return (circle * radius * Math.sqrt(3)) / -2 + radius * diff * Math.sqrt(3)
      case 5:
        return (circle * radius * Math.sqrt(3)) / 2 + (radius * diff * Math.sqrt(3)) / 2
      default:
        return 0
    }
  }
}

export const getTransY = (circle, index, radius) => {
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
        return circle * radius * -1.5
      case 4:
      case 5:
        return circle * radius * 1.5
      default:
        return 0
    }
  } else {
    // edge
    // find left vertex
    let vertex = parseInt(index / circle)
    let diff = index - vertex * circle
    switch (vertex) {
      case 0:
        return 0 - diff * radius * 1.5
      case 1:
        return circle * radius * -1.5
      case 2:
        return circle * radius * -1.5 + diff * radius * 1.5
      case 3:
        return 0 + diff * radius * 1.5
      case 4:
        return circle * radius * 1.5
      case 5:
        return circle * radius * 1.5 - diff * radius * 1.5
      default:
        return 0
    }
  }
}