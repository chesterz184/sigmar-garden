<template>
   <div @click="onClick" class="coord-item" :class="{active: coord.active && coord.pinball, selected: coord.selected}" :style="'transform: translate(' + transX + 'px, ' + transY + 'px)'" :data-coo="coord.circle + ', ' + coord.index">
		<img v-if="coord.pinball" :src="src" alt="">
	</div>
</template>
<script>
import config from "../lib/config";
export default {
  props: ["coord"],
  data() {
    return {};
  },
  computed: {
    src() {
      return "./textures/atoms/" + this.coord.pinball.element + ".png";
    },
    transX: function() {
      let { circle, index } = this.coord;
      if (index === 0 && circle === 0) {
        // 0, 0
        return 0;
      } else if (index % circle === 0) {
        // vertex coord
        let vertex = index / circle;
        switch (vertex) {
          case 0:
            return circle * config.hexRadius * Math.sqrt(3);
          case 1:
          case 5:
            return circle * config.hexRadius * Math.sqrt(3) / 2;
          case 2:
          case 4:
            return circle * config.hexRadius * Math.sqrt(3) / -2;
          case 3:
            return circle * config.hexRadius * Math.sqrt(3) * -1;
        }
      } else {
        // edge
        // find left vertex
        let vertex = parseInt(index / circle);
        let diff = index - vertex * circle;

        switch (vertex) {
          case 0:
            return (
              circle * config.hexRadius * Math.sqrt(3) -
              config.hexRadius * diff * Math.sqrt(3) / 2
            );
          case 1:
            return (
              circle * config.hexRadius * Math.sqrt(3) / 2 -
              config.hexRadius * diff * Math.sqrt(3)
            );
          case 2:
            return (
              circle * config.hexRadius * Math.sqrt(3) / -2 -
              config.hexRadius * diff * Math.sqrt(3) / 2
            );
          case 3:
            return (
              circle * config.hexRadius * Math.sqrt(3) * -1 +
              config.hexRadius * diff * Math.sqrt(3) / 2
            );
          case 4:
            return (
              circle * config.hexRadius * Math.sqrt(3) / -2 +
              config.hexRadius * diff * Math.sqrt(3)
            );
          case 5:
            return (
              circle * config.hexRadius * Math.sqrt(3) / 2 +
              config.hexRadius * diff * Math.sqrt(3) / 2
            );
        }
      }
    },
    transY: function() {
      let { circle, index } = this.coord;
      if (index === 0 && circle === 0) {
        // 0, 0
        return 0;
      } else if (index % circle === 0) {
        // vertex coord
        let vertex = index / circle;
        switch (vertex) {
          case 0:
          case 3:
            return 0;
          case 1:
          case 2:
            return circle * config.hexRadius * -1.5;
          case 4:
          case 5:
            return circle * config.hexRadius * 1.5;
        }
      } else {
        // edge
        // find left vertex
        let vertex = parseInt(index / circle);
        let diff = index - vertex * circle;

        switch (vertex) {
          case 0:
            return 0 - diff * config.hexRadius * 1.5;
          case 1:
            return circle * config.hexRadius * -1.5;
          case 2:
            return (
              circle * config.hexRadius * -1.5 + diff * config.hexRadius * 1.5
            );
          case 3:
            return 0 + diff * config.hexRadius * 1.5;
          case 4:
            return circle * config.hexRadius * 1.5;
          case 5:
            return (
              circle * config.hexRadius * 1.5 - diff * config.hexRadius * 1.5
            );
        }
      }
    }
  },
  methods: {
    onClick: function() {
      this.$emit("click-coord");
    }
  }
};
</script>
<style>
.coord-item {
	box-sizing: border-box;
  position: absolute;
  top: 50vh;
  left: 50vw;
  border-radius: 100%;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.411);
  line-height: 0;
  opacity: 0.3;
}
.coord-item.active {
  opacity: 1;
}

.coord-item.selected {
  box-shadow: 0 0 30px rgb(25, 84, 211);
  opacity: 0.7;
}

.coord-item.active:hover {
  opacity: 0.8;
}
</style>
