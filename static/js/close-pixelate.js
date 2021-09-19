/*!
 * Close Pixelate v2.0.00 beta
 * http://desandro.com/resources/close-pixelate/
 *
 * Developed by
 * - David DeSandro  http://desandro.com
 * - John Schulz  http://twitter.com/jfsiii
 *
 * Licensed under MIT license
 */

/* jshint asi: true, browser: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */

;
(function (window) {
  //
  'use strict'

  // util vars
  const TWO_PI = Math.PI * 2
  const QUARTER_PI = Math.PI * 0.25

  // utility functions
  function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }

  // https://stackoverflow.com/a/55785839/1070215
  const isFunction = (value) =>
    value &&
    (Object.prototype.toString.call(value) === '[object Function]' ||
      typeof value === 'function' ||
      value instanceof Function)

  // check for canvas support
  const canvas = document.createElement('canvas')
  const isCanvasSupported = canvas.getContext && canvas.getContext('2d')

  // don't proceed if canvas is no supported
  if (!isCanvasSupported) {
    return
  }

  function ClosePixelation(img, options) {
    this.img = img
    // creat canvas
    const canvas = (this.canvas = document.createElement('canvas'))
    this.ctx = canvas.getContext('2d')
    // copy attributes from img to canvas
    canvas.className = img.className
    canvas.id = img.id

    this.render(options)

    // replace image with canvas
    img.parentNode.replaceChild(canvas, img)
  }

  ClosePixelation.prototype.render = function (options) {
    this.options = options

    // set size
    const w = (this.width = this.canvas.width = this.img.width)
    const h = (this.height = this.canvas.height = this.img.height)
    // draw image on canvas
    this.ctx.drawImage(this.img, 0, 0, w, h)
    // get imageData

    try {
      this.imgData = this.ctx.getImageData(0, 0, w, h).data
    } catch (error) {
      if (console) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
      return
    }

    this.ctx.clearRect(0, 0, w, h)

    for (let i = 0, len = options.length; i < len; i++) {
      this.renderClosePixels(options[i])
    }
  }

  ClosePixelation.prototype.renderClosePixels = function (opts) {
    const w = this.width
    const h = this.height
    const ctx = this.ctx
    const imgData = this.imgData

    let res
    if (isFunction(opts.resolution) && opts.word) {
      const metrics = ctx.measureText(opts.word)
      res = opts.resolution(opts.word, metrics.width, metrics.height, w, h)
    } else {
      res = opts.resolution || {
        cx: 16,
        cy: 16
      }
    }

    // option defaults
    const size = opts.size || {
      cx: Math.ceil(res.cx_),
      cy: Math.ceil(res.cy_)
    }
    const alpha = opts.alpha || 1
    const offset = opts.offset || 0
    let offsetX = 0
    let offsetY = 0
    const cols = w / res.cx_ + 1
    const rows = h / res.cy_ + 1
    const halfSize = {
      cx: size.cx / 2,
      cy: size.cy / 2
    }
    const diamondSize = size.cx / Math.SQRT2
    const halfDiamondSize = diamondSize / 2

    if (isObject(offset)) {
      offsetX = offset.x || 0
      offsetY = offset.y || 0
    } else if (isArray(offset)) {
      offsetX = offset[0] || 0
      offsetY = offset[1] || 0
    } else {
      offsetX = offsetY = offset
    }

    let row, col, x_, y_, x, y, pixelY, pixelX, pixelIndex

    const markers = []
    for (row = 0; row < rows; row++) {
      y_ = (row /* - 0.5 */ ) * res.cy_
      y = Math.round(y_) + offsetY
      // normalize y so shapes around edges get color
      pixelY = Math.max(Math.min(y, h - 1), 0)

      for (col = 0; col < cols; col++) {
        x_ = (col /* - 0.5 */ ) * res.cx_
        x = Math.round(x_) + offsetX
        // normalize x so shapes around edges get color
        pixelX = Math.max(Math.min(x, w - 1), 0)

        const rgb = {
          r: 0,
          g: 0,
          b: 0
        }
        let count = 0
        for (let Y = 0; Y < res.cy; Y++) {
          for (let X = 0; X < res.cy; X++) {
            pixelIndex = (pixelX + X + (pixelY + Y) * w) * 4
            // https://sighack.com/post/averaging-rgb-colors-the-right-way
            rgb.r += imgData[pixelIndex] * imgData[pixelIndex]
            rgb.g += imgData[pixelIndex + 1] * imgData[pixelIndex + 1]
            rgb.b += imgData[pixelIndex + 2] * imgData[pixelIndex + 2]
            count++
          }
        }

        // ~~ used to floor values
        rgb.r = Math.round(Math.sqrt(rgb.r / count))
        rgb.g = Math.round(Math.sqrt(rgb.g / count))
        rgb.b = Math.round(Math.sqrt(rgb.b / count))
        ctx.fillStyle =
          'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')'

        switch (opts.shape) {
          case 'circle':
            ctx.beginPath()
            ctx.arc(x, y, halfSize.cx, halfSize.cy, TWO_PI, true)
            ctx.fill()
            ctx.closePath()
            break
          case 'diamond':
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(QUARTER_PI)
            ctx.fillRect(
              -halfDiamondSize,
              -halfDiamondSize,
              diamondSize,
              diamondSize
            )
            ctx.restore()
            break
          default:
            // square
            /* beautify ignore:start */
            /* beautify ignore:end */
            // four corners
            if (
              (row === 0 || (row + 1) % Math.round(rows) === 0) &&
              (col === 0 || (col + 1) % Math.round(cols) === 0)
            ) {
              markers.push({
                text: row + "x" + col,
                textAlign: col === 0 ? 'left' : 'right',
                x: col * res.cx_,
                y: row * res.cy_
              })
            }
            ctx.fillRect(x_ - halfSize.cx, y_ - halfSize.cy, size.cx, size.cy)
        } // switch
      } // col
    } // row
    ctx.save();
    ctx.translate(0, size.cy);
    // ctx.scale(.9, .9);
    ctx.fillStyle = 'white'
    ctx.font = '32px monospace'

    markers.forEach(m => {
      // eslint-disable-next-line no-console
      console.log(m)
      ctx.textAlign = m.textAlign
      ctx.fillText(m.text, m.x + (m.x === 0 ? 1 : -1), m.y + (m.y === 0 ? 2 : - size.cy - 2))
    })
    ctx.restore();
  }

  // enable img.closePixelate
  HTMLImageElement.prototype.closePixelate = function (options) {
    return new ClosePixelation(this, options)
  }

  // put in global namespace
  window.ClosePixelation = ClosePixelation
})(window)
