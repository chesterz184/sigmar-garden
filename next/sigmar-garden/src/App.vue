<template>
  <div class="board">
      <Hex
        v-for="(hexItem, index) in hexList"
        :hexData="hexItem"
        :hexRadius="38.1"
        :key="`hex${index}`"
      ></Hex>

    <div class="board-footer" :style="'font-size: ' + 38.1 / 2.6 + 'px'">
      <button
        :style="'font-size: ' + 38.1 / 2.6 + 'px'"
        class="btn-start"
        @click="newGame"
      >
        NEW GAME
      </button>
      <div class="status-bar">
        <!-- <coord-status :status="status.salt"></coord-status>
        <span class="status-divide">|</span>
        <coord-status :status="status.air"></coord-status>
        <coord-status :status="status.fire"></coord-status>
        <coord-status :status="status.water"></coord-status>
        <coord-status :status="status.earth"></coord-status>
        <span class="status-divide">|</span>
        <coord-status :status="status.quicksilver"></coord-status>
        <span class="status-divide">|</span>
        <coord-status :status="status.lead"></coord-status>
        <coord-status :status="status.tin"></coord-status>
        <coord-status :status="status.iron"></coord-status>
        <coord-status :status="status.copper"></coord-status>
        <coord-status :status="status.silver"></coord-status>
        <coord-status :status="status.gold"></coord-status> -->
      </div>
      <!-- <button
        :style="helpBg"
        class="btn-help"
        @click="showHelp = true"
      ></button>
      <div class="record">
        <span>WINS</span>
        <span>{{ wins }}</span>
      </div> -->
    </div>
  </div>
</template>

<script>
import './lib/public'
import Game from './lib/Game'
import Hex from './components/Hex.vue'
import { computed, reactive, ref, toRefs } from 'vue'

const game = new Game()

export default {
  name: 'App',
  components: {
    Hex,
  },
  setup() {
    const state = reactive({
      hexList: [],
    })
    const newGame = () => {
      game.initGame()
      const coords = game.getFlatCoords()
      state.hexList = []
      let idx = 0
      const insert = () => {
        if (state.hexList.length < 91) {
          let interval = coords[idx].pinball === null ? 0 : 70
          state.hexList.push(coords[idx++])
          setTimeout(insert, interval)
        }
      }
      insert()
    }

    return {
      ...toRefs(state),
      newGame,
    }
  },
}
</script>
<style>
body,
div,
p,
span,
h1,
h2,
h3,
h4,
h5 {
  margin: 0;
  padding: 0;
}
#app {
  background-image: url('./assets/background_5.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  height: 100vh;
  width: 100vw;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.board {
  background-image: url('./assets/board.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 841px;
  height: 758px;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 24px black;
  max-height: 90vh;
  max-width: 99.854881266491vh;
}
.board-footer {
  position: absolute;
  bottom: 1%;
  height: 7.1%;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.board-footer button {
  padding: 0;
  border: 0;
  height: 100%;
  z-index: 1;
}
.board-footer button:hover {
  filter: brightness(1.3);
  text-shadow: none;
  color: #eee;
}
.board-footer button:focus {
  outline: none;
}
.btn-start {
  background-color: black;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #111;
  font-weight: bold;
  /* font-family: $font; */
  text-shadow: 0 1px 1px rgba(201, 185, 143, 0.3);
  width: 15.8%;
  margin: 0 0.7%;
}
.btn-start.disabled {
  filter: brightness(0.5);
}
.btn-start.disabled:hover {
  color: #111;
  text-shadow: none;
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-enter {
  filter: brightness(2) contrast(1.3);
  opacity: 0;
}
</style>
