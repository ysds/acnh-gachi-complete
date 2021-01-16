<template>
  <div class="wrapper" :class="{ sticky: subnavs }">
    <nav class="subnav" ref="subnav">
      <template v-if="subnavs">
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
      </template>
      <template v-else>
        <button type="button" class="subnav-item active" disabled>
          {{ navText }}
        </button>
      </template>
    </nav>
  </div>
</template>

<script>
import IconPinned from "./IconPinned";
import isEqual from "lodash/isEqual";

export default {
  components: {
    IconPinned
  },
  props: {
    active: String,
    navs: Array,
    pins: Object
  },
  computed: {
    navText() {
      if (this.active) {
        const activeNavObj = this.navs.filter(nav => {
          return this.active.includes(nav.id);
        });
        if (activeNavObj.length > 0) {
          return activeNavObj[0].text;
        }
      }
      return "";
    },
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
      this.$store.commit("changeNav", id);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  background-color: #fff;
}

.sticky {
  position: sticky;
  top: 52px;
  z-index: 1008;
}

.subnav {
  display: flex;
  margin: 0 auto;
  padding: 0 0 0.5rem 1rem;
  overflow-x: auto;
  line-height: 1;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;

  &::after {
    content: "";
    padding-left: 1rem;
  }
}

.subnav-item {
  position: relative;
  padding: 3px 0.5rem;
  min-height: 38px;
  background-color: transparent;
  outline: none;
  border: 0;
  font-size: 15px;
  font-weight: 700;
  border-bottom: 3px solid transparent;

  &.active {
    color: #42b983;
    border-bottom-color: #42b983;
  }

  &.pinned {
    padding-left: 2rem;

    svg {
      position: absolute;
      top: calc(50% - 9px);
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
