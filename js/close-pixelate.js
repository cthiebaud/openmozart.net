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

;(function (window) {
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

  const console = window.console

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

  ClosePixelation.prototype.fit = function (contains) {
    return (
      parentWidth,
      parentHeight,
      childWidth,
      childHeight,
      scale = 1,
      offsetX = 0.5,
      offsetY = 0.5
    ) => {
      const childRatio = childWidth / childHeight
      const parentRatio = parentWidth / parentHeight
      let width = parentWidth * scale
      let height = parentHeight * scale

      if (contains ? childRatio > parentRatio : childRatio < parentRatio) {
        height = width / childRatio
      } else {
        width = height * childRatio
      }

      return {
        width,
        height,
        offsetX: (parentWidth - width) * offsetX,
        offsetY: (parentHeight - height) * offsetY
      }
    }
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

    // option defaults
    const res = opts.resolution || { cx: 16, cy: 16 }
    const size = opts.size || { cx: res.cx, cy: res.cy }
    const alpha = opts.alpha || 1
    const offset = opts.offset || 0
    let offsetX = 0
    let offsetY = 0
    const cols = w / res.cx + 1
    const rows = h / res.cy + 1
    const halfSize = { cx: size.cx / 2, cy: size.cy / 2 }
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

    let row, col, x, y, pixelY, pixelX, pixelIndex, red, green, blue, pixelAlpha

    for (row = 0; row < rows; row++) {
      y = (row - 0.5) * res.cy + offsetY
      // normalize y so shapes around edges get color
      pixelY = Math.max(Math.min(y, h - 1), 0)

      for (col = 0; col < cols; col++) {
        x = (col - 0.5) * res.cx + offsetX
        // normalize x so shapes around edges get color
        pixelX = Math.max(Math.min(x, w - 1), 0)
        pixelIndex = (pixelX + pixelY * w) * 4
        red = imgData[pixelIndex + 0]
        green = imgData[pixelIndex + 1]
        blue = imgData[pixelIndex + 2]
        pixelAlpha = alpha * (imgData[pixelIndex + 3] / 255)

        ctx.fillStyle =
          'rgba(' + red + ',' + green + ',' + blue + ',' + pixelAlpha + ')'

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
            ctx.fillRect(x - halfSize.cx, y - halfSize.cy, size.cx, size.cy)
        } // switch
      } // col
    } // row
  }

  // enable img.closePixelate
  HTMLImageElement.prototype.closePixelate = function (options) {
    return new ClosePixelation(this, options)
  }

  // put in global namespace
  window.ClosePixelation = ClosePixelation
})(window)
