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
  'use strict'

  // https://stackoverflow.com/a/55785839/1070215
  // prettier-ignore
  const isFunction = (value) => value && (
    Object.prototype.toString.call(value) === '[object Function]' || 
    typeof value === 'function' || 
    value instanceof Function
  )

  // check for canvas support
  const canvas = document.createElement('canvas')
  const isCanvasSupported =
    canvas.getContext &&
    canvas.getContext('2d', {
      alpha: false
    }) // sub-pixel font rendering, cf. https://stackoverflow.com/a/28161474/1070215

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
    // canvas.className = img.className
    canvas.id = img.id + '-canvas'

    this.render(options)

    // insert canvas just before image
    img.parentNode.insertBefore(canvas, img)
  }

  ClosePixelation.prototype.render = function (options) {
    this.options = options

    // https://github.com/agilie/canvas-image-cover-position
    // eslint-disable-next-line no-unused-vars
    const calcCoverPosition = function (contentWidth, contentHeight, containerWidth, containerHeight, offsetLeft, offsetTop) {
      const contentRatio = contentWidth / contentHeight
      const containerRatio = containerWidth / containerHeight
      let resultHeight
      let resultWidth
      offsetLeft = typeof offsetLeft === 'undefined' ? 0.5 : offsetLeft
      offsetTop = typeof offsetTop === 'undefined' ? 0.5 : offsetTop
      if (contentRatio > containerRatio) {
        resultHeight = containerHeight
        resultWidth = containerHeight * contentRatio
      } else {
        resultWidth = containerWidth
        resultHeight = containerWidth / contentRatio
      }
      return {
        width: resultWidth,
        height: resultHeight,
        offsetLeft: (containerWidth - resultWidth) * offsetLeft,
        offsetTop: (containerHeight - resultHeight) * offsetTop
      }
    }
    // set size
    const w = (this.width  = this.img.width)
    const h = (this.height = this.img.height)
    const coverPosition = calcCoverPosition(w, h, options.windowWidth, options.windowHeight)
    this.canvas.width  = coverPosition.width
    this.canvas.height = coverPosition.height
    // draw image on canvas
    this.ctx.save()
    if (options.filter) {
      this.ctx.filter = options.filter
    }
    this.ctx.drawImage(this.img, 0, 0, w, h, 0, 0, this.canvas.width, this.canvas.height)
    this.ctx.restore()
    // get imageData

    try {
      this.imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return
    }

    this.renderClosePixels(options)
  }

  ClosePixelation.prototype.renderClosePixels = function (opts) {
    const w = this.canvas.width
    const h = this.canvas.height
    const ctx = this.ctx
    const imgData = this.imgData

    ctx.clearRect(0, 0, w, h)

    let res
    if (isFunction(opts.resolution)) {
      res = opts.resolution(ctx, w, h)
    } else {
      res = opts.resolution || {
        cxCol: 16,
        cyRow: 16
      }
    }

    // option defaults
    const alpha = opts.alpha || 1
    const cols = res.cols || w / res.cxCol
    const rows = res.rows || w / res.cyRow
    const size = opts.size || {
      cx: Math.ceil(res.cxCol),
      cy: Math.ceil(res.cyRow)
    }
    const halfSize = {
      cx: size.cx / 2,
      cy: size.cy / 2
    }
    const cornerStrokeStyle = opts.cornerStrokeStyle || '#C0C0C0'
    const cornerFillStyle = opts.cornerFillStyle || '#C0C0C040'

    let row, col, x_, y_, x, y, pixelY, pixelX, pixelIndex

    const markers = []
    let i = 0
    let shapeResult
    for (row = 0; row < rows; row++) {
      y_ = row * res.cyRow
      y = Math.round(y_)
      // normalize y so shapes around edges get color
      pixelY = Math.max(Math.min(y, h - res.cyRow), 0)

      for (col = 0; col < cols; col++) {
        x_ = col * res.cxCol
        x = Math.round(x_)
        // normalize x so shapes around edges get color
        pixelX = Math.max(Math.min(x, w - res.cxCol), 0)

        const rgb = {
          r: 0,
          g: 0,
          b: 0
        }
        let count = 0
        for (let Y = 0; Y < res.cyRow; Y++) {
          for (let X = 0; X < res.cxCol; X++) {
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
          context.save()
          context.beginPath()
          context.moveTo(x, y)
          // top left edge
          context.lineTo(x - width / 2, y + height / 2)
          // bottom left edge
          context.lineTo(x, y + height)
          // bottom right edge
          context.lineTo(x + width / 2, y + height / 2)
          // closing the path automatically creates
          // the top right edge
          context.closePath()
          context.fill()
          context.restore()
        }

        if (isFunction(opts.shape) && opts.wordAsArray) {
          shapeResult = opts.shape(ctx, opts.wordAsArray, i, x_, y_, res.cxCol, res.cyRow, shapeResult)
        } else {
          switch (opts.shape) {
            case 'circle':
              ctx.beginPath()
              // prettier-ignore
              ctx.arc(
                x + halfSize.cx, 
                y + halfSize.cy, 
                Math.min(halfSize.cx, halfSize.cy) - 0.666, 
                0,
                Math.PI * 2,
                true)
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
        // prettier-ignore
        if ((row === 0 || (row + 1) % Math.round(rows) === 0) && 
            (col === 0 || (col + 1) % Math.round(cols) === 0)) {
          markers.push({
            text: col + 1 + '·' + (row + 1),
            x: col * res.cxCol,
            y: row * res.cyRow
          })
        }
        i++
      } // col
    } // row

    // eslint-disable-next-line no-constant-condition
    if (true) {
      ctx.save()
      ctx.fillStyle = 'azure'
      ctx.font = `20px monospace`
      markers.forEach((m, i) => {
        ctx.save()
        ctx.textAlign = m.x === 0 ? 'left' : 'right'
        ctx.textBaseline = m.y === 0 ? 'top' : 'bottom'

        const center = { x: 0, y: 0, a: 0 }
        if (m.x === 0) {
          if (m.y === 0) {
            center.x += res.cxCol + 1
            center.y += res.cxCol + 1
            center.a = 0
          } else {
            center.x += res.cxCol + 1
            center.y += res.cyRow * res.rows - res.cxCol - 2
            center.a = 3
          }
        } else if (m.y === 0) {
          center.x += res.cxCol * res.cols - res.cxCol - 1
          center.y += res.cxCol + 1
          center.a = 1
        } else {
          center.x += res.cxCol * res.cols - res.cxCol - 2
          center.y += res.cyRow * res.rows - res.cxCol - 1
          center.a = 2
        }

        ctx.translate(center.x, center.y)
        // eslint-disable-next-line no-constant-condition
        if (false) {
          ctx.fillText(m.text, 0, 0)
        }
        const radius = res.cxCol * 2
        ctx.rotate((center.a * (90 * Math.PI)) / 180)
        ctx.beginPath()
        ctx.moveTo(radius / 2, -radius / 2)

        ctx.lineTo(-radius / 2, -radius / 2)
        ctx.lineTo(-radius / 2, radius / 2)
        ctx.lineWidth = 1
        ctx.strokeStyle = cornerStrokeStyle
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(-radius / 2, -radius / 2)
        ctx.arc(-radius / 2, -radius / 2, radius, 0 * Math.PI, 0.5 * Math.PI)
        ctx.closePath()
        ctx.fillStyle = cornerFillStyle
        ctx.fill()

        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.restore()
      })
      ctx.restore()
    }
  }

  // enable img.closePixelate
  HTMLImageElement.prototype.closePixelate = function (options) {
    return new ClosePixelation(this, options)
  }

  // put in global namespace
  window.ClosePixelation = ClosePixelation
})(window)
