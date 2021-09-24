<template>
  <main class="vh-100" :style="`background-color: ${config.backgroundColor}`">
    <component :is="'style'">
      {{ styleCanvas }}
    </component>
    <h1 class="text-center" :style="`font-family: ${fontFamily(config.textSizeDefault)}; z-index: -1; color: ghostwhite; visibility: hidden;`">
      made by christophe thiebaud
    </h1>
    <img id="portrait-image" :src="config.imageURL" />
    <client-only>
      <div
        id="swiper"
        v-touch:swipe.left="onSwipe"
        v-touch:swipe.right="onSwipe"
        v-touch:tap="onTap"
        v-touch:touchhold="onPress"
        class="vh-100"
        :style="`background-color: ${config.backgroundColor}`"
      ></div>
    </client-only>
  </main>
</template>

<script>
/* _eslint-disable no-unused-expressions, no-unused-vars, no-sequences, eqeqeq, no-console, node/handle-callback-err, no-constant-condition */

import * as Vibrant from 'node-vibrant'
import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'
// https://www.npmjs.com/package/vue2-touch-events
Vue.use(Vue2TouchEvents, {
  disableClick: false,
  touchClass: '',
  tapTolerance: 10,
  touchHoldTolerance: 400,
  swipeTolerance: 30,
  longTapTimeInterval: 400,
  namespace: 'touch'
})

export default {
  data() {
    const config = {
      backgroundColor: '#160804',
      fontFamily: "'Roboto Mono'", // "'Birthstone'", // "Inconsolata", // "'Roboto Slab', serif", // "'IM Fell English SC', serif", // 'monospace', //
      fontFamilyFallback: 'monospace',
      imageFilter: 'brightness(120%)',
      imageURL: '/jpegs/Mozart-Lange-darker.jpg',
      matchBoundaryFillStyle: 'black',
      matchFillStyle: 'rgba(255, 0, 0, 0.5)',
      cornerStrokeStyle: '#FFD700',
      cornerFillStyle: '#FFD70040',
      shadowColor: '#572010',
      shadowOffsetX: 0.5,
      textSizeDefault: 20,

      word: 'MOZART',
      ersatzAsArray: undefined,
      wordAsArray: undefined,
      factorial: undefined,

      tweaks: {
        x: -1,
        y: -2,
        cx: 2,
        cy: 0,
        textSizeFix: 0
      },

      style: {
        canvas: {
          objectPositionX: '50%',
          objectPositionY: '50%',
          scaleTransform: '97%',
          backgroundColor: '#160804'
        }
      }
    }

    const toastOptions = { duration: 1000, position: 'top-center', theme: 'outline' }

    const box = { cols: undefined, rows: undefined }
    const canvas = undefined
    const hiddenPermutations = new Set()
    const matches = { horz: [], vert: [] }
    const palette = undefined
    const shuffle = undefined
    const slideshowID = undefined
    const averageTimeBetweenSlides = {slides: 1, total: 1500}
    const cheat = ''
    return {
      config,

      box,
      canvas,
      hiddenPermutations,
      matches,
      palette,
      shuffle,
      slideshowID,
      averageTimeBetweenSlides,
      toastOptions,

      cheat
    }
  },
  computed: {
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
        return Math.round(this.averageTimeBetweenSlides.total / this.averageTimeBetweenSlides.slides)
      },
      set(newTime) {
        this.averageTimeBetweenSlides.slides ++
        this.averageTimeBetweenSlides.total += newTime
      }
    },
    cheating() {
      return this.cheat === 'cheat'
    },
    styleCanvas() {
      // pretty-ignore
      return `div#swiper {
  background: ${this.config.style.canvas.backgroundColor};
}
.animate {
  background: ${this.config.style.canvas.backgroundColor};
  animation: fadeOut 3s forwards;
}
@keyframes fadeOut {
    0% {
      backdrop-filter: blur(1rem);
      background: ${this.config.style.canvas.backgroundColor};
    }
    100% {
      backdrop-filter: blur(0);
      background: transparent;
    }
}
canvas {
  object-position: ${this.config.style.canvas.objectPositionX} ${this.config.style.canvas.objectPositionY};
  transform: scale(${this.config.style.canvas.scaleTransform});
  background-color: ${this.config.style.canvas.backgroundColor};
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

    Vibrant.from(document.getElementById('portrait-image'))
      .maxColorCount(200)
      .getPalette()
      .then((palette) => {
        this.palette = palette
      })

    this.init()

    if (this.contextmenuEventListener) window.removeEventListener('contextmenu', this.contextmenuEventListener)
    this.contextmenuEventListener = window.addEventListener('contextmenu', function (e) {
      e.preventDefault()
    })
    if (this.keyupEventListener) window.removeEventListener('keyup', this.keyupEventListener)
    this.keyupEventListener = window.addEventListener('keyup', (event) => {
      if (event.code === 'Enter') {
        this.startOrStopOrToggleSlideshow(true)
        event.preventDefault()
        return
      } else if (event.code === 'Space') {
        const wasSlideshowing = typeof this.slideshow !== 'undefined'
        // try to stop this bloody slideshow in any case
        this.startOrStopOrToggleSlideshow(false)
        // if the slide show was not running, re-shuffle
        if (!wasSlideshowing) {
          this.animateShuffleAndRedraw()
        }
        event.preventDefault()
        return
      } else if (event.code === 'Escape') {
        this.cheat = ''
        this.createOrRedrawCanvas()
        event.preventDefault()
        return
      }
      if ('cheat'.includes(event.key)) {
        if (this.cheat === 'cheat') {
          return
        }
        this.cheat += event.key
        if (!'cheat'.startsWith(this.cheat)) {
          this.cheat = ''
          event.preventDefault()
        } else if (this.cheat === 'cheat') {
          this.$toast.show('Now cheating', this.toastOptions)
          this.createOrRedrawCanvas()
          event.preventDefault()
        }
      }
    })
  },

  methods: {
    fontFamily(size) {
      return `${size}px ${this.config.fontFamily}, ${this.config.fontFamilyFallback}`
    },
    onPress() {
      if (this.cheating) {
        this.cheat = ''
        this.$toast.show('Cheating stopped', this.toastOptions)
      } else {
        this.cheat = 'cheat'
        this.$toast.show('Now cheating', this.toastOptions)
      }
      this.createOrRedrawCanvas()
    },
    onSwipe() {
      this.startOrStopOrToggleSlideshow()
    },
    onTap() {
      this.animateShuffleAndRedraw()
    },
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
              resolve(true)
            }
          }, interval)
          setTimeout(() => clearInterval(poller), timeout)
        })
      }

      // do the whole gamut when image is loaded
      const that = this
      waitForFontLoad(this.fontFamily(40)).then(
        document.getElementById('portrait-image').addEventListener('load', function (e) {
          document.getElementById('swiper').classList.add('animate')
          that.createOrRedrawCanvas(this)
        })
      )
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
    toggleCheat() {
      if (this.cheat === 'cheat') {
        this.cheat = ''
      } else {
        this.cheat = 'cheat'
      }
    },
    animateShuffleAndRedraw(target) {
      target = target || 1
      const $swiper = document.getElementById('swiper')
      // https://betterprogramming.pub/how-to-restart-a-css-animation-with-javascript-and-what-is-the-dom-reflow-a86e8b6df00f
      $swiper.classList.remove('animate')
      // eslint-disable-next-line no-unused-expressions
      $swiper.offsetWidth // trigger a DOM reflow
      $swiper.classList.add('animate')
      this.shuffleAndRedraw(target)
    },
    shuffleAndRedraw(target) {
      target = target || 1
      let matches = 0
      let shuffle
      let iterations = 0
      do {
        shuffle = this.doShuffle(this.config.factorial)
        matches = this.storeMatches(shuffle)
        iterations++
        // eslint-disable-next-line no-unmodified-loop-condition
      } while (typeof target !== 'undefined' && matches < target)
      this.shuffle = shuffle

      if (!this.slideshow || !this.cheating) {
        this.$toast.show(`${this.matches.horz.length} horizontal, ${this.matches.vert.length} vertical`, {
          ...this.toastOptions,
          ...{ duration: this.timeBetweenSlides - 500 }
        })
      }
      this.createOrRedrawCanvas()
    },
    startOrStopOrToggleSlideshow(start) {
      if (typeof start === 'undefined') {
        start = typeof this.slideshow === 'undefined' // toggle
      }
      if (start && typeof this.slideshow === 'undefined') {
        this.$toast.show('Starting slideshow', this.toastOptions)
        this.shuffleAndRedraw()
        let slideshowLastredraw = new Date()
        this.slideshow = setInterval(
          function () {
            if (typeof this.slideshow !== 'undefined') {
              this.shuffleAndRedraw()
              const oldDate = slideshowLastredraw
              slideshowLastredraw = new Date()
              this.timeBetweenSlides = Math.abs((slideshowLastredraw.getTime() - oldDate.getTime()));
            }
          }.bind(this),
          2000
        )
      } else if (!start && typeof this.slideshow !== 'undefined') {
        clearInterval(this.slideshow)
        this.slideshow = undefined
        this.$toast.show('Slideshow stopped', this.toastOptions)
      }
    },
    createOrRedrawCanvas(img) {
      // const grain = 18
      const options = {
        filter: this.config.imageFilter,
        fontFamily: this.config.fontFamily,
        resolution: this.calcResolution, // { cxCol: grain, cyRow: grain }, // undefined, //
        shape: this.drawLetter, // 'circle', // 'diamond', // undefined, //
        word: this.config.word,
        wordAsArray: this.config.wordAsArray,
        cornerStrokeStyle: this.cornerStrokeStyle,
        cornerFillStyle: this.cornerFillStyle
      }
      this.textSizeDefault = undefined // triggers text size recalculation
      if (img) {
        this.canvas = img.closePixelate(options)
      } else {
        this.canvas.render(options)
      }
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
        /*
        throw new Error(
          `n (${nth}) cannot be larger than factorial (${factorial}) !!!`
        )}
        */
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
    horizontal(wordAsArray, factorial, shuffle) {
      // horz
      let permutation = []
      const candidate = { boundary: undefined, accumulator: [] }
      for (let row = 0; row < this.box.rows; row++) {
        for (let col = 0; col < this.box.cols; col++) {
          const i = col + row * this.box.cols
          if (permutation.length === 0) {
            permutation = this.pickShuffledPermutation(wordAsArray, factorial, shuffle, i / this.config.wordAsArray.length)
          }
          const letter = permutation.shift()
          if (i % this.config.wordAsArray.length === 0) {
            candidate.boundary = i - candidate.accumulator.length
          }
          const matchBoundary = this.testIfMatch(wordAsArray, candidate, letter)
          if (matchBoundary) {
            this.matches.horz.push(matchBoundary)
          }
        }
      }
    },
    vertical(wordAsArray, factorial, shuffle) {
      const candidate = { boundary: undefined, accumulator: [] }
      for (let col = 0; col < this.box.cols; col++) {
        for (let row = 0; row < this.box.rows; row++) {
          const i = col + row * this.box.cols
          const j = i / this.config.wordAsArray.length
          const k = i % this.config.wordAsArray.length
          const permutation = this.pickShuffledPermutation(wordAsArray, factorial, shuffle, j)
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
      this.vertical(this.config.wordAsArray, this.config.factorial, shuffle)

      // vert
      this.horizontal(this.config.wordAsArray, this.config.factorial, shuffle)

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
    getFontSizeToFit: (ctx, text, fontFamily, cx, cy, textSizeFix) => {
      ctx.save()
      ctx.font = fontFamily
      let w = 0
      let actualHeight = 0
      let fontHeight = 0
      text.forEach((letter) => {
        const metrics = ctx.measureText(text)
        w = Math.max((w = metrics.width))
        // https://stackoverflow.com/a/46950087/1070215
        fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
        actualHeight = Math.max(actualHeight, metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent)
        // eslint-disable-next-line no-constant-condition
        if (false) {
          // prettier-ignore
          // eslint-disable-next-line no-console
          console.log(
          'fontHeight'                , fontHeight,
          '= ( fontBoundingBoxAscent' , metrics.fontBoundingBoxAscent,
          '+ fontBoundingBoxDescent )', metrics.fontBoundingBoxDescent,
          'actualHeight'              , actualHeight,
          '= ( fontBoundingBoxAscent' , metrics.actualBoundingBoxAscent,
          '+ fontBoundingBoxAscent )' , metrics.actualBoundingBoxDescent
        )
        }
      })
      ctx.restore()
      // prettier-ignore
      return Math.min(
        cx + textSizeFix / w,
        cy + textSizeFix / actualHeight
      )
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

      if (!this.textSize) {
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // SHADOW
        ctx.shadowColor = this.config.shadowColor
        ctx.shadowOffsetX = this.config.shadowOffsetX
        // ctx.shadowOffsetY = 0
        // ctx.shadowBlur = .5

        const onePxFontFamily = this.fontFamily(1)
        this.textSizeDefault = this.getFontSizeToFit(ctx, this.config.wordAsArray, onePxFontFamily, cx, cy, this.config.tweaks.textSize)
        ctx.font = this.fontFamily(this.textSizeDefault)
      }

      // get nearest color from palette
      let mindiff = Number.MAX_SAFE_INTEGER
      let suitableTextColor = ctx.fillStyle
      for (const color in this.palette) {
        const diff = Vibrant.Util.hexDiff(this.palette[color].getHex(), ctx.fillStyle)
        if (diff < mindiff) {
          mindiff = diff
          // eslint-disable-next-line no-unused-vars
          suitableTextColor = this.palette[color].getBodyTextColor()
        }
      }

      // ctx.fillRect(x, y, cx, cy)

      if (this.cheating) {
        if (this.matches.horz.length) {
          for (let b = 0; b < this.matches.horz.length; b++) {
            const boundary = this.matches.horz[b]
            if (boundary <= i && i < boundary + this.config.wordAsArray.length) {
              ctx.save()
              ctx.fillStyle = this.config.matchFillStyle
              this.tweakAndFillRect(ctx, x, y, cx, cy)
              ctx.restore()

              if (i % word.length === 0 && this.config.matchBoundaryFillStyle) {
                ctx.save()
                ctx.fillStyle = this.config.matchBoundaryFillStyle
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
              ctx.fillStyle = this.config.matchFillStyle
              this.tweakAndFillRect(ctx, x, y, cx, cy)
              ctx.restore()
            }
          }
        }
      }
      // ctx.fillStyle = suitableTextColor
      ctx.fillText(letter, x + cx / 2, y + cy / 2)

      return anagram
    },
    calcResolution(word, eW, eH, wW, wH) {
      const factorial = this.factorialize(word.length)
      const divisorsList = this.getDivisorsList(factorial)
      const ratios = divisorsList.map((x) => {
        return {
          x,
          y: factorial / x,
          ratio: x / (factorial / x)
        }
      })

      const wordRatio = eW / eH
      const targetRatio = wW / wH / wordRatio

      const nearest = this.binarySearch(
        ratios.map((r) => r.ratio),
        targetRatio
      )
      // TODO : may be the next ratio is nearer from the target ratio ?

      const cols = ratios[nearest].x * word.length
      const rows = ratios[nearest].y
      const cxCol = wW / cols
      const cyRow = wH / rows
      this.box = { cols, rows, cxCol, cyRow, factorial }
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
body {
  position: relative;
}
div#swiper {
  z-index: 123;
}
div#swiper,
canvas {
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
