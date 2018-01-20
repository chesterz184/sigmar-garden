<template>
	<div id="app">
		<!-- <button class="btn-start" @click="debug" >solve</button> -->
		<h1>Sigma's Garden</h1>
		<div class="board-container">
			<img src="/textures/board.png" alt="board" class="board">
			<template v-for="circle in coords">
				<coord-item v-for="(item, index) in circle" :key="item.circle.toString() + index" :coord="item" :hexRadius="hexRadius" @click-coord="onClickCoord(item)"></coord-item>
			</template>
			<div class="board-footer">
				<button class="btn-start" @click="initGame">New Game</button>
			</div>
		</div>
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
			baseHexRadius: 38.1,
			hexRadius: 38.1,
			coords: [] //all the coords on board to be rendered
		}
	},
	watch: {
		"game.win": function (val) {
			if (val) {
				this.win = true
			}
		}
	},
	computed: {

	},
	mounted: function () {
		this.hexRadius = window.innerWidth >= 1000 ? this.baseHexRadius : this.baseHexRadius * window.innerWidth / 1000
		window.onresize = () => {
			this.hexRadius = window.innerWidth >= 1000 ? this.baseHexRadius : this.baseHexRadius * window.innerWidth / 1000
		}
		this.game = new Game()
		this.initGame()

		// setInterval(() => {
		// 	this.coords = this.game.coords
		// }, 100)
	},
	methods: {
		initGame: function () {
			console.log(this.hexRadius)
			this.game.newGame()
			this.coords = this.game.coords
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
body {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  //   background: rgb(189, 180, 150);
  background: url("/textures/background_5.jpg") no-repeat center top black;
  background-size: auto 100%;
}

#app {
  position: relative;
  text-align: center;
}

h1 {
  font-family: serif;
  font-size: 10vw;
  margin: 40px 0 60px 0;
  color: rgb(201, 185, 143);
}
.board-container {
  text-align: center;
  margin: 0 auto;
  position: relative;
  font-size: 0;
}
.board-footer {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0.5vw;
  height: 57px;
  width: 841px;
  //   background: #000;
  button {
    background: url("/textures/btn_bg.png") no-repeat;
    background-size: 100% 100%;
    color: #111;
    font-family: serif;
    font-weight: bold;
    font-size: 16px;
    text-shadow: 0 0 6px rgba(0, 0, 0, 0.479);
    position: absolute;
    border: 0;
    height: 100%;
    width: 16.5%;
    left: 0.6%;
    z-index: 1;
  }
  button:hover {
    background-image: url("/textures/btn_bg_hover.png");
  }
}
.board {
  position: relative;
  box-shadow: 0 0 24px black;
}
@media screen and (max-width: 1000px) {
  .board {
    width: 84.1%;
    height: auto;
  }
  .board-footer {
    width: 84.1%;
    height: 5.54vw;
		button {
			font-size: 1.5vw;
		}
  }

}
</style>