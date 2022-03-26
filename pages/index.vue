<template>
  <main id="main" class="vh-100" :style="`background-color: ${config.backgroundColor}`">
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@nytimes" />
    <meta name="twitter:creator" content="@SarahMaslinNir" />
    <meta name="twitter:title" content="Parade of Fans for Houston’s Funeral" />
    <meta
      name="twitter:description"
      content="NEWARK - The guest list and parade of limousines with celebrities emerging from them seemed more suited to a red carpet event in Hollywood or New York than than a gritty stretch of Sussex Avenue near the former site of the James M. Baxter Terrace public housing project here."
    />
    <meta name="twitter:image" content="http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-articleLarge.jpg" />
    <!-- -->
    <component :is="'style'">
      {{ style }}
    </component>
    <div :style="`font-family: ${fontFamily()}; visibility: hidden;`">force browser to load font</div>
    <img id="portrait-image" v-touch:tap="animateShuffleAndRedrawIfNoSlideshow" v-touch:touchhold="toggleCheating" class="invisible" :src="config.imageSrc" />
  </main>
</template>

<script>
/* _eslint-disable no-unused-expressions, no-unused-vars, no-sequences, eqeqeq, no-console, node/handle-callback-err, no-constant-condition */

import * as Vibrant from 'node-vibrant'
import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'

// https://www.npmjs.com/package/vue2-touch-events
Vue.use(Vue2TouchEvents, {
  disableClick: false
})

export default {
  data() {
    const box = { cols: undefined, rows: undefined }
    const canvas = undefined
    const cheat = ''
    const doToast = true
    const hiddenPermutations = new Set()
    const ignoreNextTap = false
    const matches = { horz: [], vert: [] }
    const modes = ['coloredLettersTransparentBackground', 'adaptiveLettersColoredBackground']
    const palette = undefined
    const shuffle = undefined
    const slideshowAverageTimeBetweenSlides = { slides: 1, total: 1500 }
    const slideshowID = undefined
    const toastOptions = { duration: 1200, position: 'top-center', theme: 'outline' }
    return {
      box,
      canvas,
      cheat,
      doToast,
      hiddenPermutations,
      ignoreNextTap,
      matches,
      modes,
      palette,
      shuffle,
      slideshowAverageTimeBetweenSlides,
      slideshowID,
      toastOptions
    }
  },
  computed: {
    config() {
      return require(`~/configuration.json`)
    },
    slideshow: {
      get() {
        return this.slideshowID
      },
      set(newSlideshowID) {
        this.slideshowID = newSlideshowID
      }
    },
    timeBetweenSlides: {
      get() {
        return Math.round(this.slideshowAverageTimeBetweenSlides.total / this.slideshowAverageTimeBetweenSlides.slides)
      },
      set(newTime) {
        this.slideshowAverageTimeBetweenSlides.slides++
        this.slideshowAverageTimeBetweenSlides.total += newTime
      }
    },
    cheating: {
      get() {
        return this.cheat === 'cheat'
      },
      set(cheatLetter) {
        const oldC = this.cheat === 'cheat'
        let newC = oldC
        if (typeof cheatLetter === 'boolean') {
          newC = cheatLetter
        } else if (typeof cheatLetter === 'string' && cheatLetter.length) {
          if (!oldC) {
            const newCheatString = this.cheat + cheatLetter
            if (newCheatString === 'cheat') {
              newC = true
            } else if ('cheat'.startsWith(newCheatString)) {
              this.cheat = newCheatString
            } else {
              newC = false
            }
          }
        }
        if (oldC !== newC) {
          if (newC) {
            this.cheat = 'cheat'
            if (this.doToast) this.$toast.show('Now cheating', this.toastOptions)
          } else {
            this.cheat = ''
            if (this.doToast) this.$toast.show('Stopped cheating', this.toastOptions)
          }
          this.createOrRedrawCanvas()
        }
      }
    },
    style() {
      // pretty-ignore
      return `
img, canvas {
  object-position: ${this.config.style.canvas.objectPositionX} ${this.config.style.canvas.objectPositionY};
  transform: scale(${this.config.style.canvas.scaleTransform});
}`
    }
  },
  destroyed() {
    if (this.contextmenuEventListener) window.removeEventListener('contextmenu', this.contextmenuEventListener)
    if (this.keyupEventListener) window.removeEventListener('keyup', this.keyupEventListener)
  },
  mounted() {
    this.config.wordAsArray = this.config.wordAsArray || this.config.word.split('')
    // \u00B7 is '·' https://www.compart.com/en/unicode/U+00B7
    // \u25CF is '●' https://www.compart.com/en/unicode/U+25CF
    // \u25CB is '○' https://www.compart.com/en/unicode/U+25CB
    // \u2205 is '∅' https://www.compart.com/en/unicode/U+2205
    this.config.ersatzAsArray = this.config.ersatzAsArray || Array(this.config.word.length).fill('\u2205')
    this.config.factorial = this.factorialize(this.config.wordAsArray.length)

    if (this.config.mode === 1) {
      Vibrant.from(document.getElementById('portrait-image'))
        .getPalette()
        .then((palette) => {
          this.palette = palette
        })
    }

    this.init()

    // remove context menu
    if (this.contextmenuEventListener) window.removeEventListener('contextmenu', this.contextmenuEventListener)
    this.contextmenuEventListener = window.addEventListener('contextmenu', function (e) {
      e.preventDefault()
    })

    // keyboard
    if (this.keyupEventListener) window.removeEventListener('keyup', this.keyupEventListener)
    this.keyupEventListener = window.addEventListener('keyup', (event) => {
      if (event.code === 'Enter') {
        this.startOrStopOrToggleSlideshow(true)
        event.preventDefault()
      } else if (event.code === 'Space') {
        const wasSlideshowing = typeof this.slideshow !== 'undefined'
        // try to stop this bloody slideshow in any case
        this.startOrStopOrToggleSlideshow(false)
        // if the slide show was not running, re-shuffle
        if (!wasSlideshowing) {
          this.animateShuffleAndRedraw()
        }
        event.preventDefault()
      } else if (event.code === 'Escape') {
        this.cheating = false
        event.preventDefault()
      } else if ('cheat'.includes(event.key)) {
        this.cheating = event.key
        event.preventDefault()
      }
    })
  },
  methods: {
    init() {
      // calc shuffled array
      this.shuffle = this.doShuffle(this.config.factorial)

      // calc hidden permutations
      for (let i = 0; i < this.config.factorial; i++) {
        const permutation = this.pickPermutation(this.config.wordAsArray, this.config.factorial, i)
        // https://stackoverflow.com/a/19746771/1070215
        const identicalArrays = (a1, a2) => a1.length === a2.length && a1.every((v, i) => v === a2[i])
        if (identicalArrays(permutation, this.config.wordAsArray)) {
          this.hiddenPermutations.add(i)
          // eslint-disable-next-line no-console
          console.log('REMEMBER nth permutation', i, permutation, this.hiddenPermutations)
        }
      }

      // https://stackoverflow.com/a/64192936/1070215
      function waitForFontLoad(font, timeout = 1000, interval = 10) {
        return new Promise((resolve, reject) => {
          // repeatedly poll check
          const poller = setInterval(async () => {
            try {
              await document.fonts.load(font)
            } catch (err) {
              reject(err)
            }
            if (document.fonts.check(font)) {
              clearInterval(poller)
              // eslint-disable-next-line no-console
              console.log('font loaded')
              resolve(true)
            }
          }, interval)
          setTimeout(() => clearInterval(poller), timeout)
        })
      }

      const fontLoaded = waitForFontLoad(this.fontFamily(), 2000, 100)
      const imageLoaded = new Promise(function (resolve, reject) {
        document.getElementById('portrait-image').addEventListener(
          'load',
          function (e) {
            // eslint-disable-next-line no-console
            console.log('image loaded')
            resolve(this)
          },
          { once: true } // remove event after run once
        )
      })

      // do the whole gamut when font and image are loaded
      const that = this
      Promise.all([fontLoaded, imageLoaded]).then((data) => {
        that.createOrRedrawCanvas(data[1])
        const canvasClassList = document.getElementById('portrait-image-canvas').classList
        canvasClassList.add('cover')
        canvasClassList.remove('invisible')
        const imageClassList = document.getElementById('portrait-image').classList
        imageClassList.add('cover')
        imageClassList.remove('invisible')
        imageClassList.add('animate')
      })
    },
    fontFamily(size) {
      if (!size) size = 20
      return `bold ${size}px ${this.config.fontFamily}, ${this.config.fontFamilyFallback}`
    },
    animateShuffleAndRedrawIfNoSlideshow() {
      if (typeof this.slideshow === 'undefined') {
        this.animateShuffleAndRedraw()
      }
    },
    toggleCheating(e) {
      this.ignoreNextTap = true
      this.cheating = !this.cheating
      e.preventDefault()
      e.stopPropagation()
    },
    doShuffle: (factorial) => {
      // http://stackoverflow.com/questions/20789373/shuffle-array-in-ng-repeat-angular
      // -> Fisher–Yates shuffle algorithm
      const shuffleArray = (array) => {
        let m = array.length
        let t
        let i
        // While there remain elements to shuffle
        while (m) {
          // Pick a remaining element…
          i = Math.floor(Math.random() * m--)
          // And swap it with the current element.
          t = array[m]
          array[m] = array[i]
          array[i] = t
        }
        return array
      }
      return shuffleArray([...Array(factorial).keys()])
    },
    animateShuffleAndRedraw(target) {
      if (this.ignoreNextTap) {
        this.ignoreNextTap = false
        return
      }
      const animated = document.getElementById('portrait-image')
      // https://betterprogramming.pub/how-to-restart-a-css-animation-with-javascript-and-what-is-the-dom-reflow-a86e8b6df00f
      animated.classList.remove('animate')
      // eslint-disable-next-line no-unused-expressions
      animated.offsetWidth // trigger a DOM reflow
      animated.classList.add('animate')
      this.$nextTick(() => {
        this.shuffleAndRedraw(target)
      })
    },
    shuffleAndRedraw(target) {
      target = target || 1
      let matches = 0
      let shuffle
      do {
        shuffle = this.doShuffle(this.config.factorial)
        matches = this.storeMatches(shuffle)
      } while (matches < target)
      this.shuffle = shuffle

      if (!this.cheating) {
        if (this.doToast)
          this.$toast.show(`${this.matches.horz.length} horizontal, ${this.matches.vert.length} vertical`, {
            ...this.toastOptions,
            ...{ duration: Math.max(1500, this.timeBetweenSlides - 500) }
          })
      }
      this.createOrRedrawCanvas()
    },
    startOrStopOrToggleSlideshow(start) {
      if (typeof start === 'undefined') {
        start = typeof this.slideshow === 'undefined' // toggle
      }
      if (start && typeof this.slideshow === 'undefined') {
        if (this.doToast) this.$toast.show('Starting slideshow', this.toastOptions)
        this.shuffleAndRedraw()
        let slideshowLastredraw = new Date()
        this.slideshow = setInterval(
          function () {
            if (typeof this.slideshow !== 'undefined') {
              this.shuffleAndRedraw()
              const oldDate = slideshowLastredraw
              slideshowLastredraw = new Date()
              this.timeBetweenSlides = Math.abs(slideshowLastredraw.getTime() - oldDate.getTime())
            }
          }.bind(this),
          2000
        )
      } else if (!start && typeof this.slideshow !== 'undefined') {
        clearInterval(this.slideshow)
        this.slideshow = undefined
        if (this.doToast) this.$toast.show('Slideshow stopped', this.toastOptions)
      }
    },
    createOrRedrawCanvas(img) {
      // const grain = 18
      const options = {
        cornerFillStyle: this.cornerFill,
        cornerStrokeStyle: this.cornerStroke,
        filter: this.config.imageFilter,
        resolution: this.calcResolution, // { cxCol: grain, cyRow: grain }, // undefined, //
        shape: this.drawLetter, // 'circle', // 'diamond', // undefined, //
        wordAsArray: this.config.wordAsArray,
        windowWidth: document.getElementById('main').clientWidth,
        windowHeight: document.getElementById('main').clientHeight
      }

      if (img) {
        this.canvas = img.closePixelate(options)
      } else {
        this.canvas.renderClosePixels(options)
      }
      return this.canvas
    },
    pickShuffledPermutation(wordAsArray, factorial, shuffle, nth) {
      nth = Math.floor(nth)
      const shuffled = shuffle[nth]
      if (this.hiddenPermutations.has(shuffled)) {
        return [...this.config.ersatzAsArray] // CLONE ME !!!!
      } else {
        return this.pickPermutation(wordAsArray, factorial, shuffled)
      }
    },
    // https://stackoverflow.com/a/54018834/1070215
    pickPermutation: (wordAsArray, factorial, nth) => {
      if (factorial < nth) {
        // eslint-disable-next-line no-console
        console.log(`n (${nth}) cannot be larger than factorial (${factorial}) !!!`)
        return []
      }
      // https://stackoverflow.com/a/44079852/1070215
      /*
        Let S be a copy of the initial string,
        L the length of that string and
        P the number of permutations (L!).
        T will be the n-th permutation of S, constructed step-by-step.
        Example: S = "ABCD", L = 4, and P = 24. Let's take n = 15 for the example. T should be "CBDA" at the end.

        Set P = P/L.
        Compute divmod(n, P),
        let q be the quotient (n/P) and
        r the remainder (n%P).
        Remove the q-th letter from S and append it to T.
        Set n = r,
        decrement L,
        and repeat until L = 0.
      */
      let n = nth
      const S = [...wordAsArray]
      const T = []
      let P = factorial
      let r, q, removed
      while (S.length > 0) {
        P /= S.length
        r = n % P
        q = (n - r) / P
        removed = S.splice(q, 1)[0]
        T.push(removed)
        n = r
      }
      return T
    },
    horizontal(shuffle) {
      // horz
      let permutation = []
      const candidate = { boundary: undefined, accumulator: [] }
      for (let row = 0; row < this.box.rows; row++) {
        for (let col = 0; col < this.box.cols; col++) {
          const i = col + row * this.box.cols
          const j = i / this.config.wordAsArray.length
          const k = i % this.config.wordAsArray.length
          if (permutation.length === 0) {
            permutation = this.pickShuffledPermutation(this.config.wordAsArray, this.config.factorial, shuffle, j)
          }
          const letter = permutation.shift()
          if (k === 0) {
            candidate.boundary = i - candidate.accumulator.length
          }
          const matchBoundary = this.testIfMatch(this.config.wordAsArray, candidate, letter)
          if (matchBoundary) {
            this.matches.horz.push(matchBoundary)
          }
        }
      }
    },
    vertical(shuffle) {
      const candidate = { boundary: undefined, accumulator: [] }
      for (let col = 0; col < this.box.cols; col++) {
        for (let row = 0; row < this.box.rows; row++) {
          const i = col + row * this.box.cols
          const j = i / this.config.wordAsArray.length
          const k = i % this.config.wordAsArray.length
          const permutation = this.pickShuffledPermutation(this.config.wordAsArray, this.config.factorial, shuffle, j)
          const letter = permutation[k]
          if (!candidate.boundary) {
            candidate.boundary = [i]
          } else {
            candidate.boundary.push(i)
          }
          const matchBoundary = this.testIfMatch(this.config.wordAsArray, candidate, letter)
          if (matchBoundary) {
            this.matches.vert.push(matchBoundary)
          }
        }
      }
    },
    storeMatches(shuffle) {
      // RAZ matches at start of storeMatches
      this.matches.horz.splice(0, this.matches.horz.length)
      this.matches.vert.splice(0, this.matches.vert.length)

      // vert
      this.vertical(shuffle)

      // vert
      this.horizontal(shuffle)

      return this.matches.vert.length + this.matches.horz.length
    },
    printCandidate(word, boundary) {
      const ret = []
      for (let i = 0; i < word.length; i++) {
        if (i === boundary % word.length) {
          ret.push('|')
        }
        ret.push(word[i])
      }
      return ret.join('')
    },
    resetCandidate(candidate) {
      candidate.accumulator.splice(0, candidate.accumulator.length)
      candidate.boundary = undefined
    },
    testIfMatch(target, candidate, letter) {
      let ret
      candidate.accumulator.push(letter)
      let i = 0
      for (; i < candidate.accumulator.length; i++) {
        if (candidate.accumulator[i] !== target[i]) {
          this.resetCandidate(candidate)
          break
        }
      }
      if (i === target.length) {
        ret = candidate.boundary
        this.resetCandidate(candidate)
      }
      return ret
    },
    // https://stackoverflow.com/a/56922947/1070215
    getTextRatio(ctx) {
      ctx.save()
      ctx.font = this.fontFamily()
      const metrics = ctx.measureText(this.config.word)
      const textWidth = metrics.width
      // https://stackoverflow.com/a/46950087/1070215
      // const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
      const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
      const tRatio = textWidth / textHeight
      ctx.restore()
      return tRatio
    },
    getFontSizeToFit(ctx, cxCol, cyRow) {
      ctx.save()
      const COSMOLOGICAL_CONSTANT = 20
      ctx.font = this.fontFamily(COSMOLOGICAL_CONSTANT)
      /* TODO
      text.forEach((letter) => {
      })
      */
      const metrics = ctx.measureText(this.config.word)
      const textWidth = metrics.width / this.config.word.length
      // https://stackoverflow.com/a/46950087/1070215
      const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
      ctx.restore()

      // prettier-ignore
      const textSize = Math.min(
        (cxCol + this.config.tweaks.textSizeAdjustment/ textWidth * COSMOLOGICAL_CONSTANT),
        (cyRow + this.config.tweaks.textSizeAdjustment / textHeight * COSMOLOGICAL_CONSTANT)
      )

      ctx.font = this.fontFamily(textSize)

      return textSize
    },
    tweakAndFillRect(ctx, x, y, cx, cy) {
      // prettier-ignore
      ctx.fillRect(
        x  + this.config.tweaks.x,
        y  + this.config.tweaks.y,
        cx + this.config.tweaks.cx,
        cy + this.config.tweaks.cy
      )
    },
    tweakAndStrokeRect(ctx, x, y, cx, cy) {
      // prettier-ignore
      ctx.strokeRect(
        x  + this.config.tweaks.x,
        y  + this.config.tweaks.y,
        cx + this.config.tweaks.cx,
        cy + this.config.tweaks.cy
      )
    },
    drawLetter(ctx, word, i, x, y, cx, cy, previousResult) {
      if (i > this.box.cols * this.box.rows) {
        return
      }

      let anagram = previousResult
      if (typeof anagram === 'undefined' || anagram.length === 0) {
        anagram = this.pickShuffledPermutation(this.config.wordAsArray, this.config.factorial, this.shuffle, i / word.length)
      }
      const letter = anagram.shift()

      // eslint-disable-next-line no-constant-condition
      if (true) {
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // SHADOW
        ctx.shadowColor = this.config.shadowColor
        ctx.shadowOffsetX = this.config.shadowOffsetX
        // ctx.shadowOffsetY = 0
        // ctx.shadowBlur = .5
      }

      // get nearest color from palette
      let suitableTextColor
      if (this.config.mode === 1) {
        let mindiff = Number.MAX_SAFE_INTEGER
        suitableTextColor = ctx.fillStyle
        for (const color in this.palette) {
          const diff = Vibrant.Util.hexDiff(this.palette[color].getHex(), ctx.fillStyle)
          if (diff < mindiff) {
            mindiff = diff
            // eslint-disable-next-line no-unused-vars
            suitableTextColor = this.palette[color].getBodyTextColor()
          }
        }
      }
      if (this.config.mode === 1) {
        ctx.fillRect(x, y, cx, cy)
      } else if (this.config.mode === 2) {
        ctx.save()
        ctx.globalAlpha = this.config.globalAlpha
        ctx.fillRect(x, y, cx, cy)
        ctx.restore()
      }

      if (this.cheating) {
        if (this.matches.horz.length) {
          for (let b = 0; b < this.matches.horz.length; b++) {
            const boundary = this.matches.horz[b]
            if (boundary <= i && i < boundary + this.config.wordAsArray.length) {
              ctx.save()
              ctx.filter = 'blur(3px)'
              ctx.fillStyle = this.config.matchFill
              this.tweakAndFillRect(ctx, x, y, cx, cy)
              ctx.restore()

              if (i % word.length === 0 && this.config.matchBoundaryFill) {
                ctx.save()
                ctx.fillStyle = this.config.matchBoundaryFill
                this.tweakAndFillRect(ctx, x, y, 1, cy)
                ctx.restore()
              }
            }
          }
        }

        if (this.matches.vert.length) {
          for (let b = 0; b < this.matches.vert.length; b++) {
            const boundary = this.matches.vert[b]
            if (boundary.includes(i)) {
              ctx.save()
              ctx.filter = 'blur(3px)'
              ctx.fillStyle = this.config.matchFill
              this.tweakAndFillRect(ctx, x, y, cx, cy)
              ctx.restore()
            }
          }
        }
      }
      if (suitableTextColor) {
        ctx.fillStyle = suitableTextColor
      }
      ctx.fillText(letter, x + cx / 2, y + cy / 2 + 2)

      return anagram
    },
    calcResolution(ctx, containerWidth, containerHeight) {
      const factorial = this.config.factorial
      const divisorsList = this.getDivisorsList(factorial)
      const ratios = divisorsList.map((x) => {
        return {
          x,
          y: factorial / x,
          ratio: x / (factorial / x)
        }
      })

      const wordRatio = this.getTextRatio(ctx)
      const targetRatio = containerWidth / containerHeight / wordRatio

      const nearest = this.binarySearch(
        ratios.map((r) => r.ratio),
        targetRatio
      )
      // TODO : may be the next ratio is nearer from the target ratio ?

      const cols = ratios[nearest].x * this.config.word.length
      const rows = ratios[nearest].y
      const cxCol = containerWidth / cols
      const cyRow = containerHeight / rows
      this.box = { cols, rows, cxCol, cyRow, factorial }

      this.textSizeDefault = this.getFontSizeToFit(ctx, cxCol, cyRow)

      return this.box
    },
    // https://www.freecodecamp.org/news/how-to-factorialize-a-number-in-javascript-9263c89a4b38/
    factorialize(num) {
      if (typeof num === 'undefined') return undefined
      if (num < 0) return -1
      else if (num === 0) return 1
      else {
        return num * this.factorialize(num - 1)
      }
    },
    // https://stackoverflow.com/a/43150812/1070215
    getDivisorsList(f) {
      const divisorsList = []
      const divisors = (n) =>
        [...Array(n + 1).keys()].slice(1).reduce((s, a) => {
          const divisor = !(n % a) && a
          if (divisor) divisorsList.push(divisor)
          return s + divisor
        }, 0)
      divisors(f)
      return divisorsList
    },
    // https://stackoverflow.com/a/48876270/1070215
    binarySearch(arr, target) {
      if (arr.length === 1) {
        return 0
      }

      const midpoint = Math.floor(arr.length / 2)

      if (arr[midpoint] === target) {
        return midpoint
      }

      if (arr[midpoint] > target) {
        return this.binarySearch(arr.slice(0, midpoint), target)
      } else if (arr[midpoint] < target) {
        return midpoint + this.binarySearch(arr.slice(midpoint), target)
      }
      return midpoint
    }
  }
}
</script>

<style>
main {
  position: relative;
}
.animate {
  animation: fadeOut 3s forwards;
}
@keyframes fadeOut {
  0% {
    filter: blur(20px);
    opacity: 1;
  }
  100% {
    filter: blur(0);
    opacity: 0;
  }
}
/* 
img {
  filter: blur(20px); 
}
*/
.invisible {
  opacity: 0;
}

.cover {
  display: block;
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
