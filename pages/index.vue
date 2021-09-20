<template>
  <main
    class="vh-100"
    :style="`background-color: ${backgroundColor}`"
    @click="onClick"
  >
    <!--  -->
    <img id="portrait-image" src="/jpegs/Mozart-Lange-darker.jpg" />
  </main>
</template>

<script>
export default {
  data() {
    const word = 'MOZART' // 'МОЦАРТ' // 'モーツァルト'
    const wordAsArray = word.split('')
    const backgroundColor = '#160804'
    const factorial = this.factorialize(word.length)
    const fontFamily = 'monospace'
    const shuffle = this.shuffleArray([...Array(factorial).keys()])
    const textSize = 20
    const theCanvas = {}
    const match = { boundary: undefined, candidate: [] }
    return {
      word,
      wordAsArray,
      backgroundColor,
      factorial,
      fontFamily,
      match,
      shuffle,
      textSize,
      theCanvas
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const _this = this
      document
        .getElementById('portrait-image')
        .addEventListener('load', function (e) {
          _this.createOrRedrawCanvas(this)
        })
    },
    onClick(pointerEvent) {
      this.shuffle = this.shuffleArray([...Array(this.factorial).keys()])
      this.createOrRedrawCanvas()
    },
    createOrRedrawCanvas(img) {
      // const grain = 18
      const options = {
        resolution: this.calcResolution, // { cx: grain, cy: grain, cx_: grain, cy_: grain }, //
        word: this.word,
        fontFamily: this.fontFamily,
        wordAsArray: this.word.split(''),
        shape: this.drawLetter // 'diamond' //
      }
      this.textSize = undefined
      if (img) {
        this.theCanvas = img.closePixelate(options)
      } else {
        this.theCanvas.render(options)
      }
    },
    // https://stackoverflow.com/a/54018834/1070215
    pickPermutation(wordAsArray, factorial, nth) {
      if (factorial < nth) {
        // eslint-disable-next-line no-console
        console.log(
          `n (${nth}) cannot be larger than factorial (${factorial}) !!!`
        )
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
    testIfMatch(letter, i) {
      function display(match) {
        const ret = []
        for (let i = 0; i < match.candidate.length; i++) {
          if (i === match.boundary) {
            ret.push('|')
          }
          ret.push(match.candidate[i])
        }
        return ret.join('')
      }
      function reset(match) {
        match.candidate.splice(0, match.candidate.length)
        match.boundary = undefined
      }
      if (i % this.word.length === 0) {
        this.match.boundary = this.match.candidate.length
      }
      this.match.candidate.push(letter)
      let index = 0
      for (; index < this.match.candidate.length; index++) {
        if (this.match.candidate[index] !== this.wordAsArray[index]) {
          reset(this.match)
          break
        }
      }
      if (index === this.wordAsArray.length) {
        // eslint-disable-next-line no-console
        console.log('hourrah!', display(this.match))
        reset(this.match)
      }
    },
    drawLetter(ctx, word, factorial, i, x, y, cx, cy, previousResult) {
      // https://stackoverflow.com/a/56922947/1070215
      function getFontSizeToFit(text, fontFamily) {
        ctx.save()
        ctx.font = `bold 1px ${fontFamily} `
        const metrics = ctx.measureText(text)
        const w = metrics.width
        // https://stackoverflow.com/a/46950087/1070215
        const fontHeight =
          metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
        // const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        ctx.restore()
        return Math.min(cx / w, cy / fontHeight)
      }

      let anagram = previousResult
      if (typeof anagram === 'undefined' || anagram.length === 0) {
        const random = this.shuffle[i / word.length]
        anagram = this.pickPermutation(word, factorial, random)
        if (random === 0) {
          // hide the root word
          anagram = new Array(this.word.length).fill('\u00B7') // · https://www.compart.com/en/unicode/U+00B7
        }
      }
      const letter = anagram.shift()
      if (!this.textSize) {
        this.textSize = getFontSizeToFit(letter, this.fontFamily)
      }
      ctx.font = `bold ${this.textSize}px ${this.fontFamily}`
      ctx.fillText(letter, x, y + cy, cx)
      this.testIfMatch(letter, i)
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

      const theRatio = ratios[good]
      const x = theRatio.x * word.length
      const y = theRatio.y
      const cx = wW / x
      const cy = wH / y
      return { x, y, cx, cy, factorial }
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
    },
    // http://stackoverflow.com/questions/20789373/shuffle-array-in-ng-repeat-angular
    // -> Fisher–Yates shuffle algorithm
    shuffleArray(array) {
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
}
</style>
