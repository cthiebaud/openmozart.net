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
  'use strict'

  // https://stackoverflow.com/a/55785839/1070215
  const isFunction = (value) =>
    value &&
    (Object.prototype.toString.call(value) === '[object Function]' ||
      typeof value === 'function' ||
      value instanceof Function)

  // check for canvas support
  const canvas = document.createElement('canvas')
  const isCanvasSupported = canvas.getContext && canvas.getContext('2d', {
    alpha: false
  }) // https://stackoverflow.com/a/28161474/1070215

  // don't proceed if canvas is no supported
  if (!isCanvasSupported) {
    return
  }

  function ClosePixelation(img, options) {
    this.img = img
    // create canvas
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
      // eslint-disable-next-line no-console
      console.error(error)
      return
    }

    this.ctx.clearRect(0, 0, w, h)

    this.renderClosePixels(options)
  }

  ClosePixelation.prototype.renderClosePixels = function (opts) {
    const w = this.width
    const h = this.height
    const ctx = this.ctx
    const imgData = this.imgData

    let res
    if (isFunction(opts.resolution) && opts.word) {
      ctx.font = '20px monospace'
      const metrics = ctx.measureText(opts.word)
      const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      res = opts.resolution(opts.word, metrics.width, actualHeight, w, h)
    } else {
      res = opts.resolution || {
        cx: 16,
        cy: 16
      }
    }

    // option defaults
    const size = opts.size || {
      cx: Math.ceil(res.cx),
      cy: Math.ceil(res.cy)
    }
    const alpha = opts.alpha || 1
    const cols = w / res.cx
    const rows = h / res.cy
    const halfSize = {
      cx: size.cx / 2,
      cy: size.cy / 2
    }

    let row, col, x_, y_, x, y, pixelY, pixelX, pixelIndex

    const markers = []
    let i = 0
    let shapeResult
    for (row = 0; row < rows; row++) {
      y_ = row * res.cy
      y = Math.round(y_)
      // normalize y so shapes around edges get color
      pixelY = Math.max(Math.min(y, h - res.cy), 0)

      for (col = 0; col < cols; col++) {
        x_ = col * res.cx
        x = Math.round(x_)
        // normalize x so shapes around edges get color
        pixelX = Math.max(Math.min(x, w - res.cx), 0)

        const rgb = {
          r: 0,
          g: 0,
          b: 0
        }
        let count = 0
        for (let Y = 0; Y < res.cy; Y++) {
          for (let X = 0; X < res.cx; X++) {
            pixelIndex = (pixelX + X + (pixelY + Y) * w) * 4
            // https://sighack.com/post/averaging-rgb-colors-the-right-way
            rgb.r += imgData[pixelIndex] * imgData[pixelIndex]
            rgb.g += imgData[pixelIndex + 1] * imgData[pixelIndex + 1]
            rgb.b += imgData[pixelIndex + 2] * imgData[pixelIndex + 2]
            count++
          }
        }

        // floor values
        rgb.r = Math.round(Math.sqrt(rgb.r / count))
        rgb.g = Math.round(Math.sqrt(rgb.g / count))
        rgb.b = Math.round(Math.sqrt(rgb.b / count))
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`

        function drawDiamond(context, x, y, width, height) {
          context.save();
          context.beginPath();
          context.moveTo(x, y);
          // top left edge
          context.lineTo(x - width / 2, y + height / 2);
          // bottom left edge
          context.lineTo(x, y + height);
          // bottom right edge
          context.lineTo(x + width / 2, y + height / 2);
          // closing the path automatically creates
          // the top right edge
          context.closePath();
          context.fill();
          context.restore();
        }

        if (isFunction(opts.shape) && opts.word) {
          shapeResult = opts.shape(ctx, opts.wordAsArray, res, i, x_, y_, size.cx, size.cy, shapeResult)
        } else {
          switch (opts.shape) {
            case 'circle':
              ctx.beginPath()
              ctx.arc(x + halfSize.cx, y + halfSize.cy, Math.min(halfSize.cx, halfSize.cy) - .666, 0, Math.PI * 2, true)
              ctx.fill()
              ctx.closePath()
              break
            case 'diamond':
              drawDiamond(ctx, x, y, size.cx, size.cy)
              break
            default:
              ctx.fillRect(x_, y_, size.cx, size.cy)
          } // switch
        }
        if (
          (row === 0 || (row + 1) % Math.round(rows) === 0) &&
          (col === 0 || (col + 1) % Math.round(cols) === 0)
        ) {
          markers.push({
            text: (col + 1) + "·" + (row + 1),
            x: col * res.cx,
            y: row * res.cy
          })
        }
        i++
      } // col
    } // row
    ctx.save();
    ctx.fillStyle = 'azure'
    ctx.font = `bold 20px monospace`
    markers.forEach(m => {
      ctx.textAlign = m.x === 0 ? 'left' : 'right'
      ctx.textBaseline = m.y === 0 ? 'top' : 'bottom';
      ctx.fillText(m.text,
        m.x + (m.x !== 0 ? res.cx - 2 : 0),
        m.y + (m.y !== 0 ? res.cy : 0)
      )
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
