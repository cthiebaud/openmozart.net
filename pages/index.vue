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
    const word = 'MOZART'
    const backgroundColor = '#160804'
    const fontFamily = 'monospace'
    const textSize = 20
    const theCanvas = {}
    const matches = { horz: [], vert: []}
    const shuffle = undefined
    return {
      word,
      backgroundColor,
      fontFamily,
      matches,
      shuffle,
      textSize,
      theCanvas
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
  },
  methods: {
    init() {
      const _this = this
      this.shuffle = this.doShuffle(this.factorial, this.matches)
      document
        .getElementById('portrait-image')
        .addEventListener('load', function (e) {
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
      const shuffle = shuffleArray([...Array(factorial).keys()])
      return shuffle
    },
    onClick(pointerEvent) {
      this.shuffle = this.doShuffle(this.factorial, this.matches)
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
    pickPermutation: (wordAsArray, factorial, nth) => {
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
    storeMatches() {
      // eslint-disable-next-line no-console
      console.log('RAZ matches at start of storeMatches')
      this.matches.horz.splice(0, this.matches.horz.length)
      this.matches.vert.splice(0, this.matches.vert.length)
      let anagram = []
      const match = { boundary: undefined, candidate: [] }
      for (let i = 0; i < this.wordAsArray.length * this.factorial; i++) {
        if (anagram.length === 0) {
          const random = this.shuffle[i / this.wordAsArray.length]
          anagram = this.pickPermutation(this.wordAsArray, this.factorial, random)
          if (random === 0) {
            // hide the root word
            anagram = new Array(this.wordAsArray.length).fill('\u00B7') // · https://www.compart.com/en/unicode/U+00B7
          }
        }
        const letter = anagram.shift()
        const matchBoundary = this.testIfMatch(this.wordAsArray, letter, i, match)
        if (matchBoundary) {
          this.matches.horz.push(matchBoundary)
          // eslint-disable-next-line no-console
          console.log('added match!', this.matches.horz)
        }
      }
    },
    testIfMatch: (wordAsArray, letter, index, match) => {
      let ret
      function display(word, boundary) {
        const ret = []
        for (let i = 0; i < word.length; i++) {
          if (i === boundary % word.length) {
            ret.push('|')
          }
          ret.push(word[i])
        }
        return ret.join('')
      }
      function reset(match) {
        match.candidate.splice(0, match.candidate.length)
        match.boundary = undefined
      }
      if (index % wordAsArray.length === 0) {
        match.boundary = index - match.candidate.length
      }
      match.candidate.push(letter)
      let i = 0
      for (; i < match.candidate.length; i++) {
        if (match.candidate[i] !== wordAsArray[i]) {
          reset(match)
          break
        }
      }
      if (i === wordAsArray.length) {
        ret = match.boundary
        // eslint-disable-next-line no-console
        console.log('hourrah!', display(wordAsArray, match.boundary))
        reset(match)
      }
      return ret
    },
    drawLetter(ctx, word, ratio, i, x, y, cx, cy, previousResult) {
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
        anagram = this.pickPermutation(word, ratio.factorial, random)
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
      
      // eslint-disable-next-line no-console
      // console.log('drawing letter!')
      if (this.matches.horz.length) {
        for (let b = 0; b < this.matches.horz.length; b++) {
          const boundary = this.matches.horz[b]
          if (boundary <= i && i < boundary + this.word.length) {
            ctx.save()
            ctx.fillStyle = 'rgba(255,0,0,0.45)'
            ctx.fillRect(x - 4, y + 2, cx, cy)
            if (i % word.length === 0) {
              // eslint-disable-next-line no-console
              console.log('found match!')
              ctx.fillStyle = 'black'
              ctx.fillRect(x - 3, y, 1, cy+2)
            }
            ctx.restore()
          }
        }
      }
      ctx.fillText(letter, x, y + cy, cx)
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
      this.storeMatches()
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
