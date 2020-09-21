<template>
  <div class="board">
    <transition-group name="fade">
      <Hex v-for="hexItem in hexList" :hexData="hexItem" :hexRadius="38.1" :key="`${hexItem.circle}-${hexItem.index}`" @click-hex="onClickHex(hexItem)"></Hex>
    </transition-group>

    <div class="board-footer" :style="'font-size: ' + 38.1 / 2.6 + 'px'">
      <button :style="'font-size: ' + 38.1 / 2.6 + 'px'" class="btn start" @click="newGame">NEW GAME</button>
      <div class="status-bar">
        <status :status="status.salt"></status>
        <span class="status-divide">|</span>
        <status :status="status.air"></status>
        <status :status="status.fire"></status>
        <status :status="status.water"></status>
        <status :status="status.earth"></status>
        <span class="status-divide">|</span>
        <status :status="status.quicksilver"></status>
        <span class="status-divide">|</span>
        <status :status="status.lead"></status>
        <status :status="status.tin"></status>
        <status :status="status.iron"></status>
        <status :status="status.copper"></status>
        <status :status="status.silver"></status>
        <status :status="status.gold"></status>
      </div>
      <button class="btn help" @click="showHelp = true"></button>
      <div class="record">
        <span>WINS</span>
        <span>{{ winCount }}</span>
      </div>
    </div>
  </div>

  <button class="btn solve" @click="solve">SOLVE</button>
  <button class="btn solve" @click="restart">RESTART</button>
  <img class="help-content" v-if="showHelp" src="./assets/help_content.jpg" alt="help content" @click="showHelp = false" />
</template>

<script>
import './lib/public'
import Game from './lib/Game'
import Hex from './components/Hex.vue'
import Status from './components/Status.vue'
import { reactive, toRefs, onMounted } from 'vue'

const game = new Game()

export default {
  name: 'App',
  components: {
    Hex,
    Status,
  },
  setup() {
    const state = reactive({
      isRendering: false,
      showHelp: false,
      hexList: [],
      status: Game.getInitStatus(),
      winCount: 0,
    })

    const renderBoard = () => {
      state.isRendering = true
      const coords = game.getRenderCoords()
      const len = coords.length
      state.hexList = []
      let idx = 0
      const insert = () => {
        if (state.hexList.length < len) {
          // use timeout for animation
          let interval = coords[idx].pinball === null ? 0 : 70
          state.hexList.push(coords[idx++])
          Game.updateStatus(state.hexList, state.status)
          setTimeout(insert, interval)
        } else {
          state.isRendering = false
        }
      }
      insert()
    }
    const newGame = () => {
      if (state.isRendering) {
        return
      }
      game.initGame()
      renderBoard()
    }

    const restart = () => {
      if (state.isRendering) {
        return
      }
      game.restart()
      renderBoard()
    }

    const onClickHex = (hexItem) => {
      if (state.isRendering) {
        return
      }
      game.select(hexItem)
      Game.updateStatus(state.hexList, state.status)
      state.hexList = [...game.getRenderCoords()]
      if (game.win) {
        localStorage.setItem('winCount', ++state.winCount)
      }
    }

    const solve = () => {
      game.solve()
    }

    onMounted(() => {
      if (!localStorage.getItem('winCount')) {
        localStorage.setItem('winCount', 0)
      } else {
        state.winCount = localStorage.getItem('winCount')
      }

      game.updateEvent = () => {
        state.hexList = [...game.getFlatCoords()]
      }

      newGame()
    })

    return {
      ...toRefs(state),
      restart,
      newGame,
      onClickHex,
      solve,
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
  font-family: 'Cormorant Bold', 'Garamond', 'Georgia', 'Times New Roman', serif;
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
.btn {
  background-image: url('./assets/btn_bg.png');
  background-color: black;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #111;
  font-weight: bold;
  font-family: 'Cormorant Bold', 'Garamond', 'Georgia', 'Times New Roman', serif;
  text-shadow: 0 1px 1px rgba(201, 185, 143, 0.3);
  border: 0;
  padding: 0;
  z-index: 1;
}
.btn:hover {
  filter: brightness(1.3);
  text-shadow: none;
  color: #eee;
}
.btn:focus {
  outline: none;
}
.btn.start {
  height: 100%;
  width: 15.8%;
  margin: 0 0.7%;
}
.btn.start.disabled {
  filter: brightness(0.5);
}
.btn.start.disabled:hover {
  color: #111;
  text-shadow: none;
}
.btn.solve {
  margin: 0 10px;
  width: 100px;
  height: 40px;
}

.status-bar {
  width: 64%;
  margin: 0 0.7%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-around;
}
.btn.help {
  background-image: url('./assets/help.png');
  background-color: black;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 4.5%;
  height: 100%;
}
.help-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 90vw;
  z-index: 2;
}

.record {
  height: 100%;
  width: 10.8%;
  margin-left: 1.2%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.record span {
  height: 45%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.record span:first-child {
  color: #ada69c;
  filter: drop-shadow(0 2px 1px black);
  background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#524e4a), to(#ada69c));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.fade-enter-active {
  transition: all 0.5s;
}
.fade-leave-active {
  transition: none;
}
.fade-enter-from {
  filter: brightness(2) contrast(1.3);
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
</style>
