import Flickity from 'flickity'

const els = {}

const cacheEls = () => {
  els.carousel = jQuery('.js-slider')//document.querySelector('.js-slider')
}

const initCarousels = () => {

  els.carousel.each(function(){
    console.log(jQuery(this));

    let flkty = new Flickity(this, {
      cellAlign: 'left',
      contain: true,
      groupCells: true
    });

    if (flkty.isActive) {
      els.carousel.css('opacity', 1);
    }
  })
}

const init = () => {

  cacheEls()
  if (els.carousel) {
    // els.imgs = els.carousel.querySelectorAll('img')
    // let loadCount = 0;
    // for (var i = 0; i < els.imgs.length; i++) {

    //   els.imgs[i].onload = () => {
    //     // image loaded
    //     loadCount++
    //     if (loadCount === els.imgs.length) {
    //       initCarousel()
    //     }

    //     return;
    //   }
    //   if (els.imgs[i].complete) {
    //     loadCount++
    //     // cached image load
    //     if (loadCount === els.imgs.length) {
         
    //     }
    //   }

    //   console.log('looping', i);
    // }
    initCarousels()
  }
}

document.addEventListener('DOMContentLoaded', init)
