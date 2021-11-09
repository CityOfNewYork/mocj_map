import {
  addEvent,
  removeEvent,
  addClass,
  removeClass,
  closest
} from './helpers'

const els = {}

const cacheEls = () => {
  els.compareDD = document.querySelectorAll('.compare-toggle select')
}

const toggleComp = (e) => {
	let el = e.target
	let indicator = closest(el, '.indicator');

	addClass(indicator.querySelectorAll('.comp'), 'hidden');
	removeClass(indicator.querySelectorAll('.' + el.value), 'hidden');
	console.info(el.value)
}

const init = () => {
	cacheEls()
	console.info('compare-toggle.js', els.compareDD.length);

	addEvent(els.compareDD, 'change', toggleComp)
}

document.addEventListener('DOMContentLoaded', init)