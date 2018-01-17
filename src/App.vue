<template>
	<div id="app">
		<button class="btn-start" @click="initGame">new game</button>
		<button class="btn-start" @click="debug" >solve</button>
		<template v-for="circle in coords">
			<coord-item v-for="(item, index) in circle" :key="item.circle.toString() + index" :coord="item" @click-coord="onClickCoord(item)"></coord-item>
		</template>
	</div>
</template>

<script>
import CoordItem from './components/CoordItem'
import Game from './lib/Game'

export default {
	name: 'app',
	components: {
		CoordItem
	},
	data() {
		return {
			coords: [], //all the coords on board to be rendered
		}
	},
	watch: {
		'game.win': function(val) {
			if(val) {
				this.win = true
			}
		},
	},
	computed: {
	
	},
	mounted: function () {
		this.game = new Game()
		this.initGame()

		setInterval(() => {
			this.coords = this.game.coords
		}, 100);
	},
	methods: {
		initGame: function () {
			console.log(this.game)
			this.game.newGame()
			this.coords = this.game.coords
			
		},
		onClickCoord: function (coord) {
			this.game.select = coord
			if(this.game.win) {
				alert('you win !')
			}
		},


		debug: function() {
			this.game.solve()
		}

	}
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  background: rgb(189, 180, 150);
  /* background: url('./textures/background_4.png') no-repeat; */
}

#app {
  position: relative;
}

.btn-start {
	display: block;
	margin: 20px auto;
	height: 60px;
	width: 120px;
	font-size: 20px;
	border-radius: 6px;
	border: 1px solid grey;
}
</style>