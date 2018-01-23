import Vue from 'vue'
import App from './App.vue'

import fastclick from 'fastclick'

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
//flatten array
Array.prototype.flatten = function () {
	let arr = this
	while (arr.some(item => Array.isArray(item))) {
		arr = [].concat(...arr)
	}
	return arr
}

const localStorage = window.localStorage

fastclick.attach(document.body)

new Vue({
	el: '#app',
	render: h => h(App)
})