<template>
	<div id="app" :style="bg">
		<!-- <button class="btn-start" @click="debug">solve</button> -->

		<div class="board" :style="boardBg">


			<transition-group name="fade">
				<coord-item v-for="(item, index) in coords" :key="item.circle.toString() + index" :coord="item" :hexRadius="hexRadius" @click-coord="onClickCoord(item)"></coord-item>
			</transition-group>


			<!-- <template v-for="circle in coords">
				<coord-item v-for="(item, index) in circle" :key="item.circle.toString() + index" :coord="item" :hexRadius="hexRadius" @click-coord="onClickCoord(item)"></coord-item>
			</template> -->


			<div class="board-footer" :style="'font-size: ' + hexRadius / 2.6 + 'px'">
				<button :style="btnBg + ';font-size: ' + hexRadius / 2.6 + 'px'" class="btn-start" :class="{disabled: isRendering}" @click="initGame">NEW GAME</button>
				<div class="status-bar">
					<coord-status :status="status.salt"></coord-status>
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
					<coord-status :status="status.gold"></coord-status>

				</div>
				<button :style="helpBg" class="btn-help" @click="showHelp = true"></button>
				<div class="record">
					<span>WINS</span>
					<span>{{wins}}</span>
				</div>
			</div>
		</div>

		<img class="help-content" v-if="showHelp" :src="helpContent" alt="help content" @click="showHelp = false">
	</div>
</template>

<script>
	import CoordItem from './components/CoordItem'
	import CoordStatus from './components/CoordStatus'
	import Game from "./lib/Game"

	export default {
		name: "app",
		components: {
			CoordItem,
			CoordStatus
		},
		data() {
			return {
				percent: 22.073490813648,
				hexRadius: 38.1,
				wins: 0,
				coords: [], //all the coords on board to be rendered
				status: {
					salt: {
						element: 'salt',
						count: 0,
						showCount: true,
						oddWarn: false
					},
					air: {
						element: 'air',
						count: 0,
						showCount: true,
						oddWarn: true
					},
					fire: {
						element: 'fire',
						count: 0,
						showCount: true,
						oddWarn: true
					},
					water: {
						element: 'water',
						count: 0,
						showCount: true,
						oddWarn: true
					},
					earth: {
						element: 'earth',
						count: 0,
						showCount: true,
						oddWarn: true
					},
					quicksilver: {
						element: 'quicksilver',
						count: 0,
						showCount: true,
						oddWarn: false
					},
					lead: {
						element: 'lead',
						count: 0,
						showCount: false,
						oddWarn: false
					},
					tin: {
						element: 'tin',
						count: 0,
						showCount: false,
						oddWarn: false
					},
					iron: {
						element: 'iron',
						count: 0,
						showCount: false,
						oddWarn: false
					},
					copper: {
						element: 'copper',
						count: 0,
						showCount: false,
						oddWarn: false
					},
					silver: {
						element: 'silver',
						count: 0,
						showCount: false,
						oddWarn: false
					},
					gold: {
						element: 'gold',
						count: 0,
						showCount: false,
						oddWarn: false
					},

					vitae: {
						element: 'vitae',
						count: 0,
						showCount: false,
						oddWarn: false
					},
					mors: {
						element: 'mors',
						count: 0,
						showCount: false,
						oddWarn: false
					},
				},
				showHelp: false,

				isRendering: false,

				//imgs
				bg: 'background-image: url(./textures/background_5.jpg)',
				btnBg: 'background-image: url(./textures/btn_bg.png)',
				helpBg: 'background-image: url(./textures/help.png)',
				boardBg: 'background-image: url(./textures/board.jpg)',
				helpContent: './textures/help_content.jpg'

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
			window.onresize = () => {
				this.boardWidth = document.querySelector('.board').offsetWidth
				this.hexRadius = this.boardWidth / this.percent
			}
			this.game = new Game()
			this.initGame()

			//solver test
			// setInterval(() => {
			// 	this.coords = this.game.coords
			// }, 20)
		},
		methods: {
			initGame: function () {
				if (this.isRendering) {
					return
				}
				this.coords = []
				this.game.newGame()

				// new game animation in Opus Magnum
				let idx = 0,
					flattenedCoords = this.game.coords.flatten()
				let insert = () => {
					if (this.coords.length < 91) {
						this.coords.push(flattenedCoords[idx++])
						this.status = Game.getAtomStatus(this.coords)
						// console.log(this.status)
						setTimeout(insert, 70)
					} else {
						this.isRendering = false
					}
				}

				this.isRendering = true
				insert()

				//solver test
				// this.coords = this.game.coords

				if (!localStorage.getItem('wins')) {
					localStorage.setItem('wins', 0)
				} else {
					this.wins = localStorage.getItem('wins')
				}

				// this.coords = this.game.coords
			},
			onClickCoord: function (coord) {
				this.game.select = coord
				this.status = Game.getAtomStatus(this.coords)
				console.log(this.game.getMatchPairs())
				if (this.game.win) {
					localStorage.setItem('wins', ++this.wins)
				}
			},

			debug: function () {
				this.game.solve()
			}
		}
	}
</script>

<style lang="scss">
	$font: "Cormorant Bold",
	"Garamond",
	"Georgia",
	"Times New Roman",
	serif;
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
			font-family: $font;
			text-shadow: 0 1px 1px rgba(201, 185, 143, 0.3);
			width: 15.8%;
			margin: 0 0.7%;
			&.disabled {
				filter: brightness(0.5);
				&:hover {
					color: #111;
					text-shadow: none;
				}
			}
		}
		.status-bar {
			width: 64%;
			margin: 0 0.7%; // background: #eee;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: center;
			justify-content: space-around;
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
				display: flex;
				justify-content: center;
				align-items: center;
			}
			span:first-child {
				color: #ada69c; // text-shadow: 0 2px 1px rgba(0,0,0,.9);
				filter: drop-shadow(0 2px 1px black);
				background-image: -webkit-gradient( linear,
				0 0,
				0 bottom,
				from(#524e4a),
				to(#ada69c));
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

	.fade-enter-active {
		transition: all 0.5s;
	}

	.fade-enter {
		filter: brightness(2) contrast(1.3);
		opacity: 0;
	}
</style>