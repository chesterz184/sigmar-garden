<template>
	<div id="app" :style="bg">
		<!-- <button class="btn-start" @click="debug" >solve</button> -->
		<!-- <div class="board-container"> -->
			<!-- <img src="/textures/board.png" alt="board" class="board"> -->
		<!-- <h1>Sigma's Garden</h1> -->
			<div class="board" :style="boardBg">
				<!-- <template v-for="circle in coords"> -->
					<transition-group name="fade">
					<coord-item v-for="(item, index) in coords" :key="item.circle.toString() + index" :coord="item" :hexRadius="hexRadius" @click-coord="onClickCoord(item)"></coord-item>
					<!-- <coord-item v-for="(item, index) in circle" :key="item.circle.toString() + index" :coord="item" :hexRadius="hexRadius" @click-coord="onClickCoord(item)"></coord-item> -->

					</transition-group>
				<!-- </template> -->
				<div class="board-footer">
					<button :style="btnBg" class="btn-start" :class="{disabled: isRendering}" @click="initGame">NEW GAME</button>
					<div class="status-bar"></div>
					<button :style="helpBg" class="btn-help" @click="showHelp = true"></button>
					<div class="record">
						<span>WINS</span>
						<span>0</span>
					</div>
				</div>
			</div>
			
			<img class="help-content" v-if="showHelp" :src="helpContent" alt="help content" @click="showHelp = false">
			
		<!-- </div> -->
	</div>
</template>

<script>
import CoordItem from "./components/CoordItem"
import Game from "./lib/Game"

export default {
	name: "app",
	components: {
		CoordItem
	},
	data() {
		return {
			percent: 22.073490813648,
			hexRadius: 38.1,
			coords: [], //all the coords on board to be rendered
			showHelp: false,

			isRendering: false
		}
	},
	computed: {
		bg() {
			return 'background-image: url(./textures/background_5.jpg)'
		},
		btnBg() {
			return 'background-image: url(./textures/btn_bg.png)'
		},
		helpBg() {
			return 'background-image: url(./textures/help.png)'
		},
		boardBg() {
			return 'background-image: url(./textures/board.jpg)'
		},
		helpContent() {
			return './textures/help_content.jpg'
		}
	},
	watch: {
		"game.win": function (val) {
			if (val) {
				this.win = true
			}
		}
	},
	mounted: function () {
		this.boardWidth = document.querySelector('.board').offsetWidth
		this.hexRadius = this.boardWidth / this.percent
		// this.hexRadius = window.innerWidth >= 1000 ? this.baseHexRadius : this.baseHexRadius * window.innerWidth / 1000
		window.onresize = () => {
			this.boardWidth = document.querySelector('.board').offsetWidth
			this.hexRadius = this.boardWidth / this.percent
		}
		this.game = new Game()
		this.initGame()

		// setInterval(() => {
		// 	this.coords = this.game.coords
		// }, 100)
	},
	methods: {
		initGame: function () {
			if(this.isRendering) {
				return
			}
			this.coords = []
			this.game.newGame()
			
			// new game animation in Opus Magnum
			let idx = 0, flattenedCoords = this.game.coords.flatten()
			let insert = () => {
				if(this.coords.length < 91) {
					this.coords.push(flattenedCoords[idx++])
					setTimeout(insert, 70)
				} else {
					this.isRendering = false
				}
			}

			this.isRendering = true
			insert()

			// this.coords = this.game.coords
		},
		onClickCoord: function (coord) {
			this.game.select = coord
			if (this.game.win) {
				alert("you win !")
			}
		},

		debug: function () {
			this.game.solve()
		}
	}
}
</script>

<style lang="scss">
$font: "Cormorant Bold", "Garamond", "Georgia", "Times New Roman", serif;
body {
  margin: 0;
  padding: 0;
  font-family: $font;
}

#app {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  background: no-repeat center center black;
  background-size: cover;
  text-align: center;
}

h1 {
  margin: 0;
  font-size: 90px;
  color: rgb(201, 185, 143);
}

.board-footer {
  position: absolute;
  bottom: 1%;
  height: 7.1%;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  button {
    padding: 0;
    border: 0;
    height: 100%;
    z-index: 1;
		&:hover {
			filter: brightness(1.3);
		text-shadow: none;
    color: #eee;
		}
		&:focus {
			outline: none;
		}
  }
  .btn-start {
    background-color: black;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #111;
    font-weight: bold;
    font-size: 16px;
    font-family: $font;
    text-shadow: 0 1px 1px rgba(201, 185, 143, 0.3);
    width: 15.8%;
    margin: 0 0.7%;
		&.disabled{
			filter: brightness(.5);
			&:hover {
				color: #111;
				text-shadow: none;
			}
		}
  }
  .status-bar {
    width: 64%;
    margin: 0 0.7%;
    background: #eee;
  }
  .btn-help {
    background-color: black;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 4.5%;
  }
  .record {
    height: 100%;
    width: 10.8%;
    margin-left: 1.2%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    span {
      height: 45%;
      font-size: 90%;
      line-height: 2;
    }
    span:first-child {
      color: #ada69c;
      // text-shadow: 0 2px 1px rgba(0,0,0,.9);
      filter: drop-shadow(0 2px 1px black);
      background-image: -webkit-gradient(
        linear,
        0 0,
        0 bottom,
        from(#524e4a),
        to(#ada69c)
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
.board {
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
.help-content {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	max-width: 90vw;
	z-index: 2;
}

.fade-enter-active,
 {
  transition: all 0.5s;
}
.fade-enter,
{
	filter: brightness(2) contrast(1.3);
  opacity: 0;
}
</style>