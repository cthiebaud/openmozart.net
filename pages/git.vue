<template>
  <a :href="`https://github.com/cthiebaud/${name}.net/commit/${git}`">{{ git }}</a>
</template>

<script>
export default {
  data() {
    return {
      name: this.$config.packageName
    }
  },
  computed: {
    git() {
      return require(`~/static/git.yml?raw`)
    }
  }
}
</script>
