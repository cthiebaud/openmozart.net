<template>
    <a :href="`https://github.com/cthiebaud/openmozart.net/commit/${git}`">{{git}}</a>
</template>

<script>
export default {
  computed: {
    git() {
      return require(`~/static/git.yml?raw`)
    }
  }
}
</script>
