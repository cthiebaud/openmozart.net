<template>
  <main class="vh-100" style="background-color: #1B0B03;">
    <img id="portrait-image" src="/jpegs/Mozart-Lange-darker.jpg" />
  </main>
</template>

<script>
export default {
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // eslint-disable-next-line no-console
      // console.log(rowscols)
      const _this = this
      document
        .getElementById('portrait-image')
        .addEventListener('load', function (e) {
          const rowscols = _this.getRowsCols(this.width, this.height)
          document.getElementById('portrait-image').closePixelate([
            {
              resolution: rowscols
            }
          ])
        })
    },
    getRowsCols(w, h) {
      const theWord = 'MOZART'
      const factorial = this.factorialize(theWord.length)
      const divisorsList = this.getDivisorsList(factorial)
      const ratios = divisorsList.map((x) => {
        return {
          x,
          y: factorial / x,
          ratio: x / (factorial / x)
        }
      })

      const box = {
        cx: 534.25,
        cy: 151
      }
      const boxRatio = box.cx / box.cy

      const targetRatoi = w / boxRatio / h

      let i = this.binarySearch(
        ratios.map((r) => r.ratio),
        targetRatoi
      )
      if (i < ratios.length - 1) {
        const r1 = Math.abs(targetRatoi - ratios[i].ratio)
        const r2 = Math.abs(targetRatoi - ratios[i + 1].ratio)
        if (r2 < r1) {
          i++
        }
      }

      const theRatio = ratios[i]
      // eslint-disable-next-line no-console
      // console.log('theRatio', theRatio)
      function mulitpleOfTwo(n) {
        return Math.round(n/2)* 2      }
      const x = theRatio.x * theWord.length
      const y = theRatio.y
      const cx_ =(w / x)
      const cy_ = (h / y)
      const cx = mulitpleOfTwo(cx_)
      const cy = mulitpleOfTwo(cy_)
      return { x, y, cx, cy, cx_, cy_}
    },
    // https://www.freecodecamp.org/news/how-to-factorialize-a-number-in-javascript-9263c89a4b38/
    factorialize(num) {
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
}
</style>
