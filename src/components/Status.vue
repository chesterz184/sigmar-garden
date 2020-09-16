<template>
  <div class="status-container" :style="`background-image: url('./atoms/${status.element}.png')`" :class="{ fade: status.count === 0 }">
    <span class="num-left" :class="{ warning: status.oddWarn && status.count % 2 === 1 }">{{ status.showCount ? status.count : '' }}</span>
  </div>
</template>

<script>
export default {
  props: ['status']
}
</script>

<style scoped>
.status-container {
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  height: 65%;
  width: 6.5%;
  position: relative;
}
.status-container span {
  font-size: 80%;
  color: #eee;
  position: absolute;
  right: -10%;
  top: -10%;
}
.status-container span.warning {
  color: red;
}
.status-container.fade {
  filter: brightness(0.5);
}
</style>
