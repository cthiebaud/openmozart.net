<template>
  <main class="vh-100" :style="`background-color: ${config.backgroundColor}`" @click="shuffleAndRedraw">
    <img id="portrait-image" :src="config.imageURL" />
  </main>
</template>

<script>
/* _eslint-disable no-unused-expressions, no-unused-vars, no-sequences, eqeqeq, no-console, node/handle-callback-err, no-constant-condition */

import * as Vibrant from 'node-vibrant'

export default {
  data() {
    const config = {
      backgroundColor: 'white',
      fontFamily: 'monospace',
      imageFilter: 'brightness(95%)',
      imageURL: '/jpegs/ricard.jpg',
      matchBoundaryFillStyle: undefined,
      matchFillStyle: 'rgba(255, 255, 0, .5)',
      shadowColor: '#462310',
      shadowOffsetX: 0.5,
      textAlign: 'center',
      textBaseline: 'bottom',

      word: 'RICARD',
      wordAsArray: undefined,
      factorial: undefined
    }

    const box = { cols: 720, rows: 1 }
    const canvas = undefined
    const matches = { horz: [], vert: [] }
    const palette = undefined
    const shuffle = undefined
    const slideshowID = undefined
    const textSize = undefined
    return {
      config,

      box,
      canvas,
      matches,
      palette,
      shuffle,
      slideshowID,
      textSize
    }
  },
  computed: {},
  mounted() {
    this.config.wordAsArray = this.config.word.split('')
    this.config.factorial = this.factorialize(this.config.wordAsArray.length)

    Vibrant.from(document.getElementById('portrait-image'))
      .maxColorCount(200)
      .getPalette()
      .then((palette) => {
        this.palette = palette
      })

    this.init()

    const that = this
    window.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        that.startOrStopOrToggleSlideshow(true)
      } else if (event.key === 'Escape') {
        that.startOrStopOrToggleSlideshow(false)
      }
    })
  },
  methods: {
    init() {
      const that = this
      this.shuffle = this.doShuffle(this.config.factorial)
      document.getElementById('portrait-image').addEventListener('load', function (e) {
        that.createOrRedrawCanvas(this)
      })
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
    shuffleAndRedraw() {
      this.shuffle = this.doShuffle(this.config.factorial)
      this.createOrRedrawCanvas()
    },
    startOrStopOrToggleSlideshow(start) {
      if (typeof start === 'undefined') {
        start = !this.slideshowID // toggle
      }
      if (start && !this.slideshowID) {
        this.shuffleAndRedraw()
        this.slideshowID = setInterval(
          function () {
            this.shuffleAndRedraw()
          }.bind(this),
          1000
        )
      } else if (!start && this.slideshowID) {
        clearInterval(this.slideshowID)
        this.slideshowID = undefined
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
        wordAsArray: this.config.wordAsArray
      }
      this.textSize = undefined // triggers text size recalulation
      if (img) {
        this.canvas = img.closePixelate(options)
      } else {
        this.canvas.render(options)
      }
    },
    // https://stackoverflow.com/a/54018834/1070215
    pickShuffledPermutation(nth) {
      const shuffled = this.shuffle[Math.floor(nth)]
      if (shuffled === 0) {
        // hide the root word
        // \u00B7 is '·' (https://www.compart.com/en/unicode/U+00B7)
        return new Array(this.config.wordAsArray.length).fill('\u00B7')
      } else {
        return this.pickPermutation(this.config.wordAsArray, this.config.factorial, shuffled)
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
    horizontal(r) {
      // horz
      let permutation = []
      const candidate = { boundary: undefined, accumulator: [] }
      for (let row = 0; row < this.box.rows; row++) {
        for (let col = 0; col < this.box.cols; col++) {
          const i = col + row * this.box.cols
          if (permutation.length === 0) {
            permutation = this.pickShuffledPermutation(i / this.config.wordAsArray.length)
          }
          const letter = permutation.shift()
          if (i % this.config.wordAsArray.length === 0) {
            candidate.boundary = i - candidate.accumulator.length
          }
          const matchBoundary = this.testIfMatch(this.config.wordAsArray, candidate, letter)
          if (matchBoundary) {
            this.matches.horz.push(matchBoundary)
          }
        }
      }
    },
    vertical(r) {
      const candidate = { boundary: undefined, accumulator: [] }
      for (let col = 0; col < this.box.cols; col++) {
        for (let row = 0; row < this.box.rows; row++) {
          const i = col + row * this.box.cols
          const j = i / this.config.wordAsArray.length
          const k = i % this.config.wordAsArray.length
          const permutation = this.pickShuffledPermutation(j)
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
    storeMatches() {
      // console.log('RAZ matches at start of storeMatches')
      this.matches.horz.splice(0, this.matches.horz.length)
      this.matches.vert.splice(0, this.matches.vert.length)

      // vert
      this.vertical()

      // vert
      this.horizontal()
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
    getFontSizeToFit: (ctx, text, fontFamily, cx, cy) => {
      ctx.save()
      ctx.font = `1px ${fontFamily} `
      const metrics = ctx.measureText(text)
      const w = metrics.width
      // https://stackoverflow.com/a/46950087/1070215
      const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
      const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
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
      ctx.restore()
      return Math.min(cx - 5 / w, cy - 5 / actualHeight)
    },
    drawLetter(ctx, word, i, x, y, cx, cy, previousResult) {
      if (i > this.box.cols * this.box.rows) {
        return
      }

      let anagram = previousResult
      if (typeof anagram === 'undefined' || anagram.length === 0) {
        anagram = this.pickShuffledPermutation(i / word.length)
      }
      const letter = anagram.shift()

      if (!this.textSize) {
        ctx.textAlign = this.config.textAlign
        ctx.textBaseline = this.config.textBaseline

        // SHADOW
        ctx.shadowColor = this.config.shadowColor
        ctx.shadowOffsetX = this.config.shadowOffsetX
        // ctx.shadowOffsetY = 0
        // ctx.shadowBlur = .5

        this.textSize = this.getFontSizeToFit(ctx, letter, this.config.fontFamily, cx, cy)
        ctx.font = `${this.textSize}px ${this.config.fontFamily}`
      }

      // get nearest color from palette
      let mindiff = Number.MAX_SAFE_INTEGER
      let suitableTextColor = ctx.fillStyle
      for (const color in this.palette) {
        const diff = Vibrant.Util.hexDiff(this.palette[color].getHex(), ctx.fillStyle)
        if (diff < mindiff) {
          mindiff = diff
          suitableTextColor = this.palette[color].getBodyTextColor()
        }
      }
      ctx.fillRect(x, y, cx, cy)

      if (this.matches.horz.length) {
        for (let b = 0; b < this.matches.horz.length; b++) {
          const boundary = this.matches.horz[b]
          if (boundary <= i && i < boundary + this.config.wordAsArray.length) {
            ctx.save()
            ctx.fillStyle = this.config.matchFillStyle
            ctx.fillRect(x, y, cx, cy - 1)
            ctx.restore()

            if (i % word.length === 0 && this.config.matchBoundaryFillStyle) {
              ctx.save()
              ctx.fillStyle = this.config.matchBoundaryFillStyle
              ctx.fillRect(x, y, 1, cy - 1)
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
            ctx.fillRect(x, y, cx, 2 * cy * this.config.wordAsArray.length - 1)
            ctx.restore()
          }
        }
      }
      ctx.fillStyle = suitableTextColor
      ctx.fillText(letter, x + cx / 2, y + cy - 4, cx)
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
      this.storeMatches()
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
  object-position: 50% 50%;
  transform: scale(0.98);
  background-color: transparent;
}
</style>
