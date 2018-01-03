import Vue from 'vue'
import App from './App.vue'

//shuffle Array
Array.prototype.shuffle = function () {
	var input = this

	for (let i = input.length - 1; i >= 0; i--) {

		let randomIndex = Math.floor(Math.random() * (i + 1))
		let itemAtIndex = input[randomIndex]

		input[randomIndex] = input[i]
		input[i] = itemAtIndex
	}
	return input
}

new Vue({
  el: '#app',
  render: h => h(App)
})
