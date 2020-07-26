<template>
  <div>
    <nav class="nav">
      <button
        type="button"
        v-for="link in links"
        class="nav-item"
        :class="{ active: active && active.includes(link.id) }"
        :key="link.id"
        @click="changeNav(link.id)"
      >
        {{ link.text }}
      </button>
    </nav>
    <div class="wrapper" v-if="subnavs">
      <nav class="subnav">
        <button
          type="button"
          v-for="subnav in subnavs"
          class="subnav-item"
          :class="{ active: active === subnav.id }"
          :key="subnav.id"
          @click="changeNav(subnav.id)"
        >
          {{ subnav.text }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav",
  props: {
    active: String,
    links: Array
  },
  computed: {
    subnavs: function() {
      if (this.active) {
        const activeNavObj = this.links.filter(link => {
          return this.active.includes(link.id);
        });
        if (activeNavObj.length > 0) {
          return activeNavObj[0].subnavs;
        }
      }
      return null;
    }
  },
  methods: {
    changeNav(id) {
      this.$emit("change", id);
    }
  }
};
</script>

<style scoped lang="scss">
.nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}

.nav-item {
  margin-top: 0.5rem;
  padding: 2px 0;
  background-color: transparent;
  outline: none;
  font-weight: bold;
  border-width: 0 0 3px;
  border-style: solid;
  border-color: transparent;
  border-radius: 2px;
  touch-action: manipulation;

  + .nav-item {
    margin-left: 0.5rem;
  }

  &.active {
    color: #42b983;
    border-bottom-color: #42b983;
  }
}

.wrapper {
  display: flex;
}

.subnav {
  display: flex;
  align-items: center;
  margin: 0 auto;
  padding: 0.5rem;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.subnav-item {
  margin-right: 0.25rem;
  margin-left: 0.25rem;
  padding: 8px 1rem 5px;
  background-color: #fff;
  outline: none;
  border: 0;
  font-size: 14px;
  font-weight: 700;
  border: 1px solid #ccc;
  border-radius: 100px;

  &.active {
    color: #fff;
    background-color: #21bec5;
    border-color: #21bec5;
  }
}
</style>
