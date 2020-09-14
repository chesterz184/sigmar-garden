<template>
  <img alt="Vue logo" src="./assets/logo.png" />
</template>

<script>
  import Game from './lib/Game'
  export default {
    name: 'App',
    setup() {
      const game = new Game()
      game.initGame()
      console.log(game)
    }
  }
</script>
