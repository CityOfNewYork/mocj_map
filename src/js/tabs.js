import {
  addEvent,
  removeEvent,
  addClass,
  removeClass
} from './helpers'

const els = {}

const cacheEls = () => {
  els.tabs = document.querySelectorAll('.js-tab')
  els.content = document.querySelectorAll('.tabs__content')
  els.closeTargets =  jQuery('.category-full-content, .tabs')
}

const tabChange = (radio) => {
  console.log('tabs changed', radio);
  //let radio = e.currentTarget

  let id = radio.id
  let parent = radio.parentElement
  
  radio.checked = true;

  if (parent.classList.contains('checked')) return;

  let content = document.getElementById('tab-' + id)
console.log('ID','tab-' + id)
  parent.classList.add('checked')
  let unchecked = [...els.tabs].filter((el) => {
    if (!el.checked) {  
      el.parentElement.classList.remove('checked')
      console.log(el);
//      window.location.hash =  id
      /* history push state */      
    }
  })

  removeClass(els.content, 'in-view')
  console.log('content',content)
  content.classList.add('in-view')
}

const showPriorityArea = (th) => {
  let cat_content = th.next('.priority-category__content').clone();
  console.log('cat_content',cat_content);
  els.closeTargets
    .addClass('show')
    .find('.category-full-content__inner')
    .html(cat_content);
  
  scrollToTabs();
  
}

const scrollToTabs = () => {
  jQuery("html, body").animate({scrollTop: (jQuery('#main-content').offset().top - 75) + "px" },100);
}

const closePriorityArea = () => {
  els.closeTargets.removeClass('show');
  scrollToTabs();
}

const init = () => {
  cacheEls()
  if (els.tabs.length) {
    let hash = window.location.hash
    addEvent(els.tabs, 'click', function(e){
      let radio = e.currentTarget
      tabChange(radio);
      
      let pageHash = '#' + radio.id;
      history.pushState({tab: radio.id}, pageHash, pageHash);
    })
    console.log(hash == '');
    if(hash == ''){
      history.replaceState({tab: 'success'}, "#success", "#success");
    }
    else{
      jQuery(hash).click()
    }
  }

  //let cat_el = jQuery('.category-full-content, .tabs')
  els.closeTargets.on('click', '.close', function(){
    history.pushState({tab: 'priorities'}, "#priorities", "#priorities");
    els.closeTargets.removeClass('show');
  })
  jQuery('.goal-toggle').on('click', function(){
    console.log('toggle');
    jQuery(this).next().toggleClass('show');
  })
  jQuery('.priority-area-goals a').on('click', function(){
    let th = jQuery(this);
    let slug = th.data('goal');
    console.log('click', slug)
    showPriorityArea(th);
    history.pushState({'pa': slug},  '#' + slug, '#' + slug);
  })

  /* History */
   window.addEventListener('popstate', function(e){
    console.log("pop: " + document.location + ", state: " + JSON.stringify(e.state));
    if(e.state == null){
      console.log('home');
    }
    else if(e.state.pa){
      console.log('goto priority area', e.state.pa);
      //tabChange(document.getElementById('goals'));

      if(e.state.pa == undefined || e.state.pa == null){
        closePriorityArea();
      }
      else{
        showPriorityArea(jQuery('.' + e.state.pa));
      }
    }
    else if(e.state.tab){
      console.log('back', e.state.tab, e.state.tab != null);
      let tab = (e.state.tab != null) ? document.getElementById(e.state.tab) : document.getElementById('priorities')
      tabChange(tab);
      if(tab.id == 'priorities'){
        console.log('tab close priority areas');
        closePriorityArea();
      }

    }
  });
}

document.addEventListener('DOMContentLoaded', init)
