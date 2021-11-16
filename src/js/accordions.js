import {
  addEvent,
  removeEvent,
  addClass,
  removeClass,
  closest
} from './helpers'

import { initGraphs, resetGraphs } from './graphs'

const els = {}

const cacheEls = () => {
  els.accordion = document.querySelectorAll('.js-accordion')
  els.trigger = document.querySelectorAll('.js-trigger')
  els.accordionLg = document.querySelectorAll('.js-accordion-alt')
  els.triggerLg = document.querySelectorAll('.js-trigger-alt')
}

const toggleLgAccordions = (e) => {
  e.preventDefault()
  console.log('large init');
  let el = e.target;
  let content = el.previousElementSibling;
  let totalHeight = 0;

  for (let i = 0; i < content.children.length; i++) {
    totalHeight += content.children[i].scrollHeight;

    let styles = window.getComputedStyle(content.children[i])
    let margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom'])
    totalHeight += margin
  }

  console.log(totalHeight)

  if (totalHeight <= 205) {
    el.classList.add('disabled')
    return
  }

  el.classList.toggle('open')

  if (el.classList.contains('open')) {
    el.innerText = 'Read Less'
    content.style.maxHeight = `${totalHeight}px`
  } else {
    content.style.maxHeight = '200px'
    el.innerText = 'Read More'
  }
}

const toggleAccordions = (e) => {
  let el = e.target;
  let content = el.nextElementSibling
  let totalHeight = 0
  el.parentElement.classList.toggle('open')

  totalHeight = el.nextElementSibling.scrollHeight
  // check if current is a sub-accordion
  if (el.classList.contains('sub-accordion__trigger')) {
    subAccordions(el, totalHeight)
  }

  //init with sub-accordions open
  if(!el.classList.contains('loaded')){
    let childAccordions = content.querySelectorAll('.sub-accordion__trigger');
    if (childAccordions && childAccordions.length){
      for (let i = 0; i < childAccordions.length; i++) {
        let child = childAccordions[i]
        let childContent = child.nextElementSibling;
        let childHeight = child.nextElementSibling.scrollHeight
        subAccordions(child, childHeight)
        if (childContent.parentElement.classList.contains('open')) {
          childContent.style.height = `${childHeight}px`
          totalHeight += parseInt(childContent.style.height)
        } else {
          childContent.style.height = 0
        }
      }
    }
  }

  if (el.parentElement.classList.contains('open')) {
    content.style.height = `${totalHeight}px`
  } else {
    content.style.height = 0
  }

  el.classList.add('loaded')

}

const subAccordions = (el, totalHeight) => {
  let parentAccord = closest(el, '.js-accordion-content')

  if (el.parentElement.classList.contains('open')) {
    parentAccord.style.height = `${parentAccord.scrollHeight + totalHeight}px`
    initGraphs(el)
  } else {
    parentAccord.style.height = parentAccord.scrollHeight;
    resetGraphs(el)
  }
}

const init = () => {
  cacheEls()

  if (els.accordion) {
    els.accordion.forEach((accordion) => {
      accordion.querySelector('.js-accordion-content').style.height = '0';
    });

    addEvent(els.trigger, 'click', toggleAccordions)
  }

  if (els.triggerLg) {
    addEvent(els.triggerLg, 'click', toggleLgAccordions)
  }
}

document.addEventListener('DOMContentLoaded', init)
