<template>
  <div>
    <nav class="nav">
      <button
        type="button"
        v-for="nav in navs"
        class="nav-item"
        :class="{ active: active && active.includes(nav.id) }"
        :key="nav.id"
        @click="changeNav(nav.subnavs ? nav.subnavs[0].id : nav.id)"
      >
        {{ nav.text }}
      </button>
      <router-link class="nav-item nav-item-about" to="/about">
        使い方
      </router-link>
    </nav>
    <div class="wrapper" v-if="subnavs">
      <nav class="subnav" ref="subnav">
        <button
          type="button"
          v-for="subnav in subnavs"
          class="subnav-item"
          :class="{ active: active === subnav.id, pinned: pins[subnav.id] }"
          :key="subnav.id"
          @click="changeNav(subnav.id)"
        >
          <IconPinned v-if="pins[subnav.id]" />
          {{ subnav.alttext ? subnav.alttext : subnav.text }}
          <span class="subnav-subtext" v-if="subnav.subtext">
            {{ subnav.subtext }}
          </span>
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
import IconPinned from "./IconPinned";
import isEqual from "lodash/isEqual";

export default {
  name: "Nav",
  components: {
    IconPinned
  },
  props: {
    active: String,
    navs: Array,
    pins: Object
  },
  computed: {
    subnavs: function() {
      if (this.active) {
        const activeNavObj = this.navs.filter(nav => {
          return this.active.includes(nav.id);
        });
        if (activeNavObj.length > 0) {
          return activeNavObj[0].subnavs;
        }
      }
      return null;
    }
  },
  watch: {
    subnavs(value, oldValue) {
      if (!isEqual(value, oldValue) && this.$refs.subnav) {
        this.$refs.subnav.scrollLeft = 0;
      }
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
  position: relative;
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

  &.pinned {
    padding-left: 2rem;

    svg {
      position: absolute;
      top: calc(50% - 8px);
      left: 12px;
      width: 16px;
      height: 16px;
    }
  }
}

.subnav-subtext {
  display: block;
  font-size: 12px;
  font-weight: 400;
}
</style>
