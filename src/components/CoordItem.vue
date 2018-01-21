<template>
   <div @click="onClick" class="coord-item" :class="{active: coord.active && coord.pinball, selected: coord.selected, shadow: coord.pinball}" :style="style" :data-coo="coord.circle + ', ' + coord.index">
		<img :src="hovered" alt="hover" class="atom-hover">
		<div class="atom-container">
			<!-- <transition name="fade"> -->
			<img v-if="coord.pinball" :src="src" alt="">
			<!-- </transition> -->
		</div>
	</div>
</template>
<script>
// import config from "../lib/config"
export default {
	props: ["coord", "hexRadius"],
	data() {
		return {}
	},
	computed: {
		src() {
			return `./textures/atoms/${this.coord.pinball.element}.png`
		},
		hovered() {
			return './textures/hovered.png'
		},
		transX() {
			let { circle, index } = this.coord
			if (index === 0 && circle === 0) {
				// 0, 0
				return 0
			} else if (index % circle === 0) {
				// vertex coord
				let vertex = index / circle
				switch (vertex) {
					case 0:
						return circle * this.hexRadius * Math.sqrt(3)
					case 1:
					case 5:
						return circle * this.hexRadius * Math.sqrt(3) / 2
					case 2:
					case 4:
						return circle * this.hexRadius * Math.sqrt(3) / -2
					case 3:
						return circle * this.hexRadius * Math.sqrt(3) * -1
				}
			} else {
				// edge
				// find left vertex
				let vertex = parseInt(index / circle)
				let diff = index - vertex * circle

				switch (vertex) {
					case 0:
						return (
							circle * this.hexRadius * Math.sqrt(3) -
							this.hexRadius * diff * Math.sqrt(3) / 2
						)
					case 1:
						return (
							circle * this.hexRadius * Math.sqrt(3) / 2 -
							this.hexRadius * diff * Math.sqrt(3)
						)
					case 2:
						return (
							circle * this.hexRadius * Math.sqrt(3) / -2 -
							this.hexRadius * diff * Math.sqrt(3) / 2
						)
					case 3:
						return (
							circle * this.hexRadius * Math.sqrt(3) * -1 +
							this.hexRadius * diff * Math.sqrt(3) / 2
						)
					case 4:
						return (
							circle * this.hexRadius * Math.sqrt(3) / -2 +
							this.hexRadius * diff * Math.sqrt(3)
						)
					case 5:
						return (
							circle * this.hexRadius * Math.sqrt(3) / 2 +
							this.hexRadius * diff * Math.sqrt(3) / 2
						)
				}
			}
		},
		transY() {
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
						return circle * this.hexRadius * -1.5
					case 4:
					case 5:
						return circle * this.hexRadius * 1.5
				}
			} else {
				// edge
				// find left vertex
				let vertex = parseInt(index / circle)
				let diff = index - vertex * circle

				switch (vertex) {
					case 0:
						return 0 - diff * this.hexRadius * 1.5
					case 1:
						return circle * this.hexRadius * -1.5
					case 2:
						return (
							circle * this.hexRadius * -1.5 + diff * this.hexRadius * 1.5
						)
					case 3:
						return 0 + diff * this.hexRadius * 1.5
					case 4:
						return circle * this.hexRadius * 1.5
					case 5:
						return (
							circle * this.hexRadius * 1.5 - diff * this.hexRadius * 1.5
						)
				}
			}
		},
		style() {
			return `top: calc(50% - ${this.hexRadius * 1.6}px); left: calc(50% - ${this.hexRadius * 0.7}px); transform: translate(${this.transX}px, ${this.transY}px); width: ${this.hexRadius * 1.4}px; height: ${this.hexRadius * 1.4}px;`
		}
	},
	methods: {
		onClick: function () {
			this.$emit("click-coord")
		}
	}
}
</script>
<style lang="scss">
.coord-item {
  box-sizing: border-box;
  position: absolute;
  border-radius: 100%;
  line-height: 0;
  opacity: 0.3;
}
.coord-item.shadow {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.811);
}
.coord-item.active {
  opacity: 1;
}
.coord-item.active:hover {
  opacity: 0.8;
}
.coord-item.selected {
  box-shadow: 0 0 20px rgb(255, 255, 255), 0 0 20px rgb(255, 255, 255) inset;
  /* opacity: 0.7; */
}
.coord-item .atom-container img {
  width: 100%;
}
.coord-item.selected .atom-container img {
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
.coord-item.active .atom-hover:hover {
  opacity: 0.7;
}
.coord-item.selected .atom-hover {
  opacity: 0.4;
}

// .fade-enter-active,
//  {
//   transition: all 0.5s;
// }
// .fade-enter,
// {
// 	filter: brightness(2) contrast(2);
//   opacity: 0;
// }
</style>
