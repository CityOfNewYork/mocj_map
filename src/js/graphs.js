import {
  addEvent,
  removeEvent,
  addClass,
  removeClass,
  closest
} from './helpers'

const els = {}

const cacheEls = (parentEl) => {
  els.bars = parentEl.querySelectorAll('.bars')
}

const fillGraphs = () => {
  for(let j=0; j < els.bars.length; j++ ){
    let barGroup = els.bars[j].querySelectorAll('.bar-fill')
    let barMax = 0;
    // console.log('bar group', barGroup.length)
    for (let i = 0; i < barGroup.length; i++) {
      let bar = barGroup[i]
      
      if(parseInt(bar.dataset.barVal) > barMax){
        barMax = parseInt(bar.dataset.barVal)
      }
      //console.log('fill graphs', bar.dataset.barVal, barMax, parseInt(bar.dataset.barVal) > barMax)
    }
    for (let i = 0; i < barGroup.length; i++) {
      let bar = barGroup[i]
      let width = ((bar.dataset.barVal / barMax) * 100)
      let transitionDelay = 0.15 * (i + 1)
      //console.log('fill bars', bar.dataset.barVal, barMax)
      bar.style.transitionDelay = `${transitionDelay}s`
      bar.style.width = width + '%'
    }
  }
}

const resetGraphs = (parentEl) => {
  cacheEls(parentEl.nextElementSibling)
  for(let j=0; j < els.bars.length; j++ ){
    let barGroup = els.bars[j].querySelectorAll('.bar-fill')
    for (let i = 0; i < barGroup.length; i++) {
      barGroup[i].style.width = 0
      barGroup[i].style.transitionDelay = `0.3s`
    }
  }
}

const initGraphs = (parentEl) => {
  console.info('init',parentEl.nextElementSibling)
  cacheEls(parentEl.nextElementSibling)
  fillGraphs()
}

export { initGraphs, resetGraphs }
