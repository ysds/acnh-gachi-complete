<template>
  <div>
    <nav class="nav">
      <button
        type="button"
        v-for="link in links"
        class="nav-item"
        :class="{ active: active && active.includes(link.id) }"
        :key="link.id"
        @click="changeNav(link.subnavs ? link.subnavs[0].id : link.id)"
      >
        {{ link.text }}
      </button>
      <router-link class="nav-item nav-item-about" to="/about">
        使い方
      </router-link>
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
          <span class="subnav-subtext" v-if="subnav.subtext">
            {{ subnav.subtext }}
          </span>
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
  margin-bottom: 0.25rem;
}

.nav-item {
  margin: 0.5rem 0.33rem 0;
  padding: 2px 0;
  background-color: transparent;
  outline: none;
  font-weight: bold;
  border-width: 0 0 3px;
  border-style: solid;
  border-color: transparent;
  border-radius: 2px;
  color: #444;
  touch-action: manipulation;

  &.active {
    color: #42b983;
    border-bottom-color: #42b983;
  }
}

.nav-item-about {
  color: #ff617c;
}

.wrapper {
  display: flex;
}

.subnav {
  display: flex;
  margin: 0 auto;
  padding: 0.5rem;
  overflow-x: auto;
  line-height: 1;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.subnav-item {
  margin-right: 0.25rem;
  margin-left: 0.25rem;
  padding: 6px 1rem 3px;
  min-height: 40px;
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

.subnav-subtext {
  display: block;
  font-size: 12px;
  font-weight: 400;
}
</style>
