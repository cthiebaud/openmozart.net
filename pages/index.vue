<template>
  <main class="vh-100">
    <img id="portrait-image" src="/jpegs/Mozart-Lange-darker.jpg" />
  </main>
</template>

<script>
export default {
  mounted() {
    this.init() // method1 will execute at pageload
  },
  methods: {
    init() {
      // eslint-disable-next-line no-console
      console.log('inited')
      document
        .getElementById('portrait-image')
        .addEventListener('load', function () {
          document
            .getElementById('portrait-image')
            .closePixelate([{ resolution: 48 }])
        })
    }
  }
}
</script>

<style>
body {
  position: relative;
}
canvas {
  background-color: #ccc;
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
