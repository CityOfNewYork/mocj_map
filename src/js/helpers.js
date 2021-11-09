const addRemoveEvent = function(action, els, eventName, callback, options) {
  for (let i = els.length - 1; i >= 0; i--) {
    els[i][action](eventName, callback, options);
  }
  return els;
}

const addEvent = (els, eventName, callback, options = {}) => {
  return addRemoveEvent('addEventListener', els, eventName, callback, options);
}

const removeEvent = (els, eventName, callback, options = {}) => {
  return addRemoveEvent('removeEventListener', els, eventName, callback, options);
}

const addRemoveClass = (action, els, className) => {
  for (let i = els.length - 1; i >= 0; i--) {
    els[i].classList[action](className);
  }
  return els;
}

const addClass = (els, className) => {
  return addRemoveClass('add', els, className);
}

const removeClass = (els, className) => {
  return addRemoveClass('remove', els, className);
}

const toggleClass = (els, className) => {
  if (!els.length) {
    toggleSingleClass(els, className);
  } else {
    for (let i = els.length - 1; i >= 0; i--) {
      toggleSingleClass(els[i], className);
    }
  }

  return els;
}

const toggleSingleClass = (el, className) => {
  let action = el.classList.contains(className) ? 'remove' : 'add';
  el.classList[action](className);
  return el;
}

const checkForClass = (els, targetClass) => {
  for (let i = els.length - 1; i >= 0; i--) {
    if (els[i].classList.contains(targetClass)) return true;
  }

  return false;
}

const throttle = (func, wait, options) => {
  let context, args, result;
  let timeout = null;
  let previous = 0;
  if (!options) options = {};
  const later = function() {
    previous = options.leading === false ? 0 : _now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  }
  return function() {
    let now = _now();
    if (!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  }
}

// Gets the current timestamp
const _now = Date.now || function() {
  return new Date().getTime();
}

const checkCookie = (cookieName) => {
  var dc = document.cookie;
  var prefix = cookieName + '=';
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }

  return unescape(dc.substring(begin + prefix.length, end));
}

const setCookie = (cookieName, hours) => {
  if (hours) {
    var expDate = new Date();
    expDate.setTime(expDate.getTime()+(setTime(hours)));
    document.cookie = cookieName + '=true; path=/; expires=' + expDate.toGMTString() + ';';
  } else {
    document.cookie = cookieName + '=true; path=/;'
  }
}

const setTime = (hours) => { return hours*60*60*1000 }


const closest = (el, selector) => {
  var matchesFn;

  // find vendor prefix
  ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
    if (typeof document.body[fn] == 'function') {
      matchesFn = fn;
      return true;
    }
    return false;
  })

  var parent;

  // traverse parents
  while (el) {
    parent = el.parentElement;
    if (parent && parent[matchesFn](selector)) {
      return parent;
    }
    el = parent;
  }

  return null;
}

export {
  addEvent,
  removeEvent,
  addClass,
  removeClass,
  toggleClass,
  checkForClass,
  throttle,
  checkCookie,
  setCookie,
  closest
}
