<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">あつ森ガチコンプ</router-link>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 1.05rem 1rem;

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
