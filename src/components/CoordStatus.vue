<template>
  <div class="coord-status-container" :style="style" :class="{fade: status.count === 0}">
     <span class="num-left" :class="{warning: status.oddWarn && status.count % 2 === 1}">{{status.showCount ? status.count : ''}}</span>
  </div>
</template>

<script>
export default {
  props: ['status'],
  data() {
     return {

     }
  },
  mounted: function() {
    
  },
  computed: {
    style() {
      return `background-image: url(./textures/atoms/${this.status.element}.png)`
    }
  }
}
</script>

<style lang="scss" scoped>
.coord-status-container {
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  height: 65%;
  width: 6.5%;
  position: relative;
   span {
     font-size: 80%;
      color: #eee;
      position: absolute;
      right: -10%;
      top: -10%;
      &.warning {
        color: red;
      }
   }
   &.fade {
     filter: brightness(0.5);
   }
}
</style>
