<template>
  <div class="drawer">
    <nav class="nav">
      <router-link
        v-for="nav in navs"
        :key="nav.id"
        class="nav-item"
        :class="{ active: active && active.includes(nav.id) }"
        to="/"
        @click.native="changeNav(nav.subnavs ? nav.subnavs[0].id : nav.id)"
      >
        {{ nav.text }}
      </router-link>
      <router-link
        class="nav-item nav-item-about"
        to="/about"
        @click.native="toggleDrawer"
      >
        使い方
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    active: String,
    navs: Array,
    pins: Object
  },
  methods: {
    toggleDrawer() {
      this.$store.commit("toggleDrawer");
    },
    changeNav(id) {
      this.toggleDrawer();
      this.$store.commit("changeNav", id);
    }
  }
};
</script>

<style scoped lang="scss">
.drawer {
  position: fixed;
  top: 52px;
  right: 0;
  left: 0;
  z-index: 1010;
  background-color: #fff;
  padding: 0 8px 1rem;
}

.nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-item {
  margin: 0.25rem 0.33rem;
  padding: 5px 0;
  outline: none;
  font-weight: bold;
  text-decoration: none;
  color: #444;
  touch-action: manipulation;

  &.active {
    color: #42b983;
  }
}

.nav-item-about {
  color: #ff617c;
}
</style>
