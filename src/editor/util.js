import * as _ from 'lodash-es'
import * as types from './types'

export function isObject(obj) {
  return obj && typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

export function isParentTo(target, parent) {
  let currentNode = target
  while (currentNode !== null) {
    if (currentNode === parent) return true
    currentNode = currentNode.parentNode
  }
  return false
}

/**
 *
 * @param {String} target
 * @param {Object} schema
 */
export function getTypeFromSchema(target, schema) {
  const tempTarget = target.split('.')
  tempTarget.shift()
  const value = _.get(schema, tempTarget.join('.'))
  if (value === types.Text) return 'text'
  if (value === types.Title) return 'title'
  if (value === types.Button) return 'button'
  if (value === types.Link) return 'link'
  if (value === types.ClassList) return 'section'
  if (value === types.StyleObject) return 'section'
  if (value === types.Label) return 'text'
  if (value === types.Cost) return 'text'
  if (value === types.Delimiter) return 'delimiter'
  if (value === types.SystemRequirements) return 'section'
  if (value === types.TextInherit) return 'text'

  return null
}

export function getImageBlob(URL) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', URL)
    xhr.responseType = 'blob'

    xhr.onload = function () {
      const imageBlob = this.response
      const fileType = this.response.type.split('/')[1].split('+')[0]
      const randomNumber = new Date().getUTCMilliseconds()
      const filename = `image-${randomNumber}.${fileType}`
      resolve({ blob: imageBlob, name: filename })
    }
    xhr.send(null)
  })
}

export function getTypeFromTagName(tagName) {
  tagName = tagName.toUpperCase()
  switch (tagName) {
    case 'H1':
      return 'title'
    case 'H2':
      return 'title'
    case 'H3':
      return 'title'
    case 'H4':
      return 'title'
    case 'H5':
      return 'title'
    case 'H6':
      return 'title'
    case 'P':
      return 'text'
    case 'B':
      return 'text'
    case 'SPAN':
      return 'title'
    case 'BUTTON':
      return 'button'
    case 'A':
      return 'button'
    case 'SECTION':
      return 'section'
    case 'HEADER':
      return 'section'
    default:
      break
  }
}

export function cleanDOM(artboard) {
  const editables = Array.from(artboard.querySelectorAll('.is-editable'))
  const uploaders = Array.from(artboard.querySelectorAll('.uploader'))
  const stylers = Array.from(artboard.querySelectorAll('.styler'))
  const controls = Array.from(artboard.querySelectorAll('.ptah-control'))

  editables.forEach((el) => {
    el.contentEditable = 'inherit'
    el.classList.remove('is-editable')
  })
  uploaders.forEach((el) => {
    const input = el.querySelector(':scope > form input')
    const image = el.querySelector(':scope > img')

    image.classList.add('add-full-width')
    el.classList.remove('uploader')
    input.remove()
  })
  stylers.forEach((styler) => {
    styler.remove()
  })
  controls.forEach((control) => {
    control.remove()
  })
}

export function randomPoneId() {
  return `pone${Math.random().toString().substring(2, 7)}`
}

/**
 * Return template of scoped style for el
 * @param poneId
 * @param data {Object} Like:
 *  {
 *    'hover': {
 *      'background-color': '#f2f3f6',
 *      'color': '#000000'
 *    }
 *  }
 * @returns {string}
 */
export function getPseudoTemplate(poneId, data) {
  let content = ''
  _.forEach(data, (styles, pseudo) => {
    let acc = ''
    _.forEach(styles, (value, style) => {
      acc += `${style}: ${value};`
    })
    content += `[data-pone="${poneId}"]:${pseudo} {
      ${acc}
    }`
  })

  return `<style type="text/css" id="${poneId}">${content}</style>`
}

/**
 * Return Google site tag template
 * @param tag
 */
export function gtagSetup(tag) {
  if (tag === '') return tag
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${tag}"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${tag}');
          </script>
          `
}

/**
 * Swap array elements
 * @param _arr
 * @param _param {Array} - [index, newIndex]
 */
export function correctArray (_arr, _param) {
  _arr[_param[1]] = _arr.splice(_param[0], 1, _arr[_param[1]])[0]
}

/**
 * Retrives youtubeId from youtube video url
 * Example: https://www.youtube.com/watch?v=Xv1JzYDKoc8 -> Xv1JzYDKoc8
 *
 * @param {String} url
 * @return {String}
 */
export function getYoutubeVideoIdFromUrl (url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : false
}

export function placeCaretAtEnd (el) {
  el.focus();
  if (typeof window.getSelection != "undefined"
    && typeof document.createRange != "undefined") {
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
}

/**
 * Set cookie
 *
 * @param {String} name
 * @param {String} value
 * @param {Object} options -> { path, domain, secure }
 *
 * path -> path for cookie
 * domain -> domain for cookie
 * secure -> secure policy
 */
export function setCookie (name, value, options = {}) {
  let expires = options.expires

  if (expires && typeof expires === 'number' && expires instanceof Number) {
    let date = new Date()
    date.setTime(date.getTime() + expires * 1000)
    expires = options.expires = date
    if (expires.toUTCString) {
      options.expires = expires.toUTCString()
    }
  }

  let updatedCookie = `${name}=${encodeURIComponent(value)}`

  for (let propName in options) {
    updatedCookie += `; ${propName}`
    let propValue = options[propName]
    if (propValue !== true) {
      updatedCookie += `=${propValue}`
    }
  }

  document.cookie = updatedCookie
}

/**
 * Get cookie
 *
 * @param {String} name
 */
export function getCookie (name) {
  let matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + '=([^;]*)'
  ));
  return matches ? decodeURIComponent(matches[1]) : null
}

/**
 * Delete cookie
 *
 * @param {String} name
 */
export function deleteCookie (name) {
  void setCookie(name, '', { expires: -1 })
}

/**
 * fit text
 *
 * Copyright 2011, Dave Rupert http://daverupert.com
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 * Modified by Slawomir Kolodziej http://slawekk.info
 *
 * Date: Tue Aug 09 2011 10:45:54 GMT+0200 (CEST)
 *
 * @param {String} selector
 */
export function fitText (element, compressor, options) {
  compressor = compressor || 1
  options = options || {}

  options = Object.assign(options, {
    minFontSize: (-1) / 0,
    maxFontSize: 1 / 0,
    children: false
  })

  let fit = function () {
    let resizer = function () {
      let clientWidth = element.clientWidth / (compressor * 10)
      let size = Math.max(
        Math.min(clientWidth, parseFloat(options.maxFontSize)),
        parseFloat(options.minFontSize)
      )
      element.style.fontSize = `${ size }px`
    }

    void resizer()

    window.addEventListener('resize', resizer, false)
    window.addEventListener('orientationchange', resizer, false)
  }

  if (options.children && element.children.length) {
    [...element.children].forEach(child => void fit(child))
  }

  fit(element)

  return element
}

/*!
* FitText.js 1.0 jQuery free version
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
* Modified by Slawomir Kolodziej http://slawekk.info
*
* Date: Tue Aug 09 2011 10:45:54 GMT+0200 (CEST)
*/
// (function(){

//   var addEvent = function (el, type, fn) {
//     if (el.addEventListener)
//       el.addEventListener(type, fn, false);
// 		else
// 			el.attachEvent('on'+type, fn);
//   };

//   var extend = function(obj,ext){
//     for(var key in ext)
//       if(ext.hasOwnProperty(key))
//         obj[key] = ext[key];
//     return obj;
//   };

//   window.fitText = function (el, kompressor, options) {

//     var settings = extend({
//       'minFontSize' : -1/0,
//       'maxFontSize' : 1/0
//     },options);

//     var fit = function (el) {
//       var compressor = kompressor || 1;

//       var resizer = function () {
//         el.style.fontSize = Math.max(Math.min(el.clientWidth / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)) + 'px';
//       };

//       // Call once to set.
//       resizer();

//       // Bind events
//       // If you have any js library which support Events, replace this part
//       // and remove addEvent function (or use original jQuery version)
//       addEvent(window, 'resize', resizer);
//       addEvent(window, 'orientationchange', resizer);
//     };

//     if (el.length)
//       for(var i=0; i<el.length; i++)
//         fit(el[i]);
//     else
//       fit(el);

//     // return set of elements
//     return el;
//   };
// })();