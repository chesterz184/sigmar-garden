<template>
  <div
    class="hex-item"
    :class="{
      active: hexData.active && hexData.pinball,
      selected: hexData.selected,
      shadow: hexData.pinball,
    }"
    :style="`
      top: calc(50% - ${hexRadius * 1.6}px);
      left: calc(50% - ${hexRadius * 0.7}px);
      transform: translate(${transX}px, ${transY}px);
      width: ${hexRadius * 1.4}px;
      height: ${hexRadius * 1.4}px;`"
    @click="$emit('click-hex')"
  >
    <img src="../assets/hovered.png" alt="" class="atom-hover" />
    <div class="atom-container">
      <img v-if="hexData.pinball" :src="`./atoms/${hexData.pinball.element}.png`" :alt="hexData.pinball.element" />
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
const getTransX = (circle, index, radius) => {
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
    }
  }
}
const getTransY = (circle, index, radius) => {
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
    }
  }
}
export default {
  name: 'Hex',
  props: {
    hexData: Object,
    hexRadius: Number,
  },
  setup(props) {
    const transX = getTransX(props.hexData.circle, props.hexData.index, props.hexRadius)
    const transY = getTransY(props.hexData.circle, props.hexData.index, props.hexRadius)

    return {
      transX,
      transY,
    }
  },
}
</script>
<style scoped>
.hex-item {
  box-sizing: border-box;
  position: absolute;
  border-radius: 100%;
  line-height: 0;
  opacity: 0.3;
}
.hex-item.shadow {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.811);
}
.hex-item.active {
  opacity: 1;
}
.hex-item.active:hover {
  opacity: 0.8;
}
.hex-item.selected {
  box-shadow: 0 0 20px rgb(255, 255, 255), 0 0 20px rgb(255, 255, 255) inset;
  /* opacity: 0.7; */
}
.hex-item .atom-container img {
  width: 100%;
}
.hex-item.selected .atom-container img {
  filter: brightness(1.1) opacity(0.8) contrast(1.05);
}
.atom-container {
  overflow: hidden;
  border-radius: 100%;
}
.atom-hover {
  width: 130%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: 0.1s ease all;
  z-index: 1;
}
.hex-item.active .atom-hover:hover {
  opacity: 0.7;
}
.hex-item.selected .atom-hover {
  opacity: 0.4;
}
</style>
