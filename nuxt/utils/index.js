// eslint-disable-next-line no-extend-native
Array.prototype.wait = function(onItem, callback, thread, tmp) {
  var self = this
  var init = false

  // INIT
  if (!tmp) {
    if (typeof (callback) !== 'function') {
      thread = callback
      callback = null
    }

    tmp = {}
    tmp.pending = 0
    tmp.index = 0
    tmp.thread = thread
    tmp.next = function(type) {
      if (type === 'cancel' || tmp.canceled) {
        tmp.pending--
        tmp.canceled = true
        if (!tmp.pending && callback) { callback('cancel') }
      } else {
        setTimeout(function() {
          next_wait(self, onItem, callback, thread, tmp)
        }, 0)
      }
    }

    // thread === Boolean then array has to be removed item by item
    init = true
  }

  var item = thread === true ? self.shift() : self[tmp.index++]
  if (item === undefined) {
    if (!tmp.pending) {
      callback && callback()
      tmp.canceled = true
    }
    return self
  }

  tmp.pending++
  onItem.call(self, item, tmp.next, tmp.index)

  if (!init || tmp.thread === 1) { return self }

  for (var i = 1; i < tmp.thread; i++) { self.wait(onItem, callback, 1, tmp) }

  return self
}

function next_wait(self, onItem, callback, thread, tmp) {
  tmp.pending--
  self.wait(onItem, callback, thread, tmp)
}

export function Pace(t, w, h, x, y) {
  let c = 0
  let p = 0
  x = x || 0
  y = y || 0
  if (t === 'male') {
    c = 358
    p = parseInt((w * c) / h)
  } else {
    c = 386
    p = parseInt((w * c) / h)
  }

  return {
    position_x: 1080 / 2 - p / 2,
    position_y: c / 2 - 60,
    resize_width: p,
    resize_height: c
  }
}

export function sleep(time) {
  return new Promise((rev) => setTimeout(rev, time))
}

export function IMAGE(src) {
  const img = new Image()
  img.src = src
  img.crossOrigin = 'anonymous'
  return new Promise((rev, rej) => {
    img.onload = function() {
      rev(img)
    }
    img.onerror = rej
  })
}

export function XWAIT(list, callback, num) {
  return new Promise((rev) => {
    list.wait(
      callback,
      () => {
        rev(list)
      },
      num
    )
  })
}

export function downloadBase64Img(t) {
  const e = base64StringToBlob(t.url)
  const s = URL.createObjectURL(e)
  const a = document.createElement('a')
  a.setAttribute('href', s)
  a.setAttribute('download', t.title)
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
export function base64StringToBlob(t) {
  for (
    var e = t.split(','),
      s = e[0].match(/:(.*?);/)[1],
      a = atob(e[1]),
      i = a.length,
      n = new Uint8Array(i);
    i--;

  ) { n[i] = a.charCodeAt(i) }
  return new Blob([n], { type: s })
}
