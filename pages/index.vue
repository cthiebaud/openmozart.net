<template>
  <main class="vh-100" :style="`background-color: ${backgroundColor}`" @click="shuffleAndRedraw">
    <!--  -->
    <img id="portrait-image" :src="imageURL" />
  </main>
</template>

<script>
/* _eslint-disable no-unused-expressions, no-unused-vars, no-sequences, eqeqeq, no-console */

export default {
  data() {
    const word = 'MOZART'
    const backgroundColor = '#160804'
    const filter = 'brightness(120%)'
    const fontFamily = 'monospace'
    const imageURL = '/jpegs/Mozart-Lange-darker.jpg'
    const slideshowID = undefined
    const matches = { horz: [], vert: [] }
    const matchFillStyle = 'rgba(255, 0, 0, 0.5)'
    const matchBoundaryFillStyle = 'black'
    const shuffle = undefined
    const textSize = 20
    const theCanvas = {}
    const theRatio = {}
    return {
      word,
      backgroundColor,
      filter,
      fontFamily,
      imageURL,
      slideshowID,
      matches,
      matchFillStyle,
      matchBoundaryFillStyle,
      shuffle,
      textSize,
      theCanvas,
      theRatio
    }
  },
  computed: {
    wordAsArray() {
      return this.word.split('')
    },
    factorial() {
      return this.factorialize(this.wordAsArray.length)
    }
  },
  mounted() {
    this.init()
    const _this = this
    window.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        _this.startOrStopOrToggleSlideshow(true)
      } else if (event.key === 'Escape') {
        _this.startOrStopOrToggleSlideshow(false)
      }
    })
  },
  methods: {
    init() {
      const _this = this
      this.shuffle = this.doShuffle(this.factorial)
      document.getElementById('portrait-image').addEventListener('load', function (e) {
        _this.createOrRedrawCanvas(this)
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
      this.shuffle = this.doShuffle(this.factorial)
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
        filter: this.filter,
        fontFamily: this.fontFamily,
        resolution: this.calcResolution, // { cx: grain, cy: grain, cx_: grain, cy_: grain }, //
        shape: this.drawLetter, // 'diamond' // 'circle'
        word: this.word,
        wordAsArray: this.wordAsArray
      }
      this.textSize = undefined // triggers text size recalulation
      if (img) {
        this.theCanvas = img.closePixelate(options)
      } else {
        this.theCanvas.render(options)
      }
    },
    // https://stackoverflow.com/a/54018834/1070215
    pickShuffledPermutation(nth) {
      const shuffled = this.shuffle[Math.floor(nth)]
      if (shuffled === 0) {
        // hide the root word
        // \u00B7 is '·' (https://www.compart.com/en/unicode/U+00B7)
        return new Array(this.wordAsArray.length).fill('\u00B7')
      } else {
        return this.pickPermutation(this.wordAsArray, this.factorial, shuffled)
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
      for (let row = 0; row < this.theRatio.y; row++) {
        for (let col = 0; col < this.theRatio.x; col++) {
          const i = col + row * this.theRatio.x
          if (permutation.length === 0) {
            permutation = this.pickShuffledPermutation(i / this.wordAsArray.length)
          }
          const letter = permutation.shift()
          if (i % this.wordAsArray.length === 0) {
            candidate.boundary = i - candidate.accumulator.length
          }
          const matchBoundary = this.testIfMatch(this.wordAsArray, candidate, letter)
          if (matchBoundary) {
            this.matches.horz.push(matchBoundary)
          }
        }
      }
    },
    vertical(r) {
      const candidate = { boundary: undefined, accumulator: [] }
      for (let col = 0; col < this.theRatio.x; col++) {
        for (let row = 0; row < this.theRatio.y; row++) {
          const i = col + row * this.theRatio.x
          const j = i / this.wordAsArray.length
          const k = i % this.wordAsArray.length
          const permutation = this.pickShuffledPermutation(j)
          const letter = permutation[k]
          candidate.boundary = candidate.boundary || i
          const matchBoundary = this.testIfMatch(this.wordAsArray, candidate, letter)
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
      return Math.min(cx + 2 / w, cy + 2 / actualHeight)
    },
    drawLetter(ctx, word, i, x, y, cx, cy, previousResult) {
      if (i > this.theRatio.x * this.theRatio.y) {
        return
      }

      let anagram = previousResult
      if (typeof anagram === 'undefined' || anagram.length === 0) {
        anagram = this.pickShuffledPermutation(i / word.length)
      }
      const letter = anagram.shift()

      if (!this.textSize) {
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'

        // SHADOW
        ctx.shadowColor = '#572010'
        ctx.shadowOffsetX = 0.5
        // ctx.shadowOffsetY = 0
        // ctx.shadowBlur = .5

        this.textSize = this.getFontSizeToFit(letter, this.fontFamily, cx, cy)
        ctx.font = `${this.textSize}px ${this.fontFamily}`
      }

      if (i % this.theRatio.x < this.theRatio.x - this.wordAsArray.length) {
        // ^^^ do not display matches in the last column ^^^
        if (this.matches.horz.length) {
          for (let b = 0; b < this.matches.horz.length; b++) {
            const boundary = this.matches.horz[b]
            if (boundary <= i && i < boundary + this.word.length) {
              if (boundary === i) {
                ctx.save()
                ctx.fillStyle = this.matchFillStyle
                ctx.fillRect(x, y - 2, cx * this.word.length - 1, cy - 1)
                ctx.restore()
              } else if (i % word.length === 0) {
                ctx.save()
                ctx.fillStyle = this.matchBoundaryFillStyle
                ctx.fillRect(x, y - 2, 1, cy - 1)
                ctx.restore()
              }
            }
          }
        }
      }

      if (this.matches.vert.length) {
        for (let b = 0; b < this.matches.vert.length; b++) {
          const boundary = this.matches.vert[b]
          if (boundary <= i && i < boundary + this.word.length) {
            if (boundary === i) {
              ctx.save()
              ctx.fillStyle = this.matchFillStyle
              ctx.fillRect(x, y - 3, cx, cy * this.word.length - 1)
              ctx.restore()
            }
          }
        }
      }

      ctx.fillText(letter, x + cx / 2, y + cy, cx)
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

      const good = this.binarySearch(
        ratios.map((r) => r.ratio),
        targetRatio
      )

      const x = ratios[good].x * word.length
      const y = ratios[good].y
      const cx = wW / x
      const cy = wH / y
      this.theRatio = { x, y, cx, cy, factorial }
      return this.theRatio
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
  background-color: #160804;
}
</style>
