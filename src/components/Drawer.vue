<template>
  <div class="drawer">
    <div class="navs">
      <nav class="nav">
        <router-link
          v-for="nav in navs"
          :key="nav.id"
          class="nav-item"
          :class="[
            {
              active: active && active.startsWith(nav.id),
              separator: nav.separator,
            },
            nav.class,
          ]"
          to="/"
          @click.native="
            !nav.separator
              ? changeNav(nav.subnavs ? nav.subnavs[0].id : nav.id)
              : undefined
          "
          :tabindex="nav.separator ? -1 : undefined"
        >
          <template v-if="!nav.separator">
            <inline-svg :src="require(`../assets/nav/${nav.id}.svg`)" />
            {{ nav.text }}
          </template>
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
  </div>
</template>

<script>
import InlineSvg from "vue-inline-svg";

export default {
  components: {
    InlineSvg,
  },
  props: {
    active: String,
    navs: Array,
    pins: Object,
  },
  methods: {
    toggleDrawer() {
      this.$store.commit("toggleDrawer");
    },
    changeNav(id) {
      this.toggleDrawer();
      this.$store.commit("changeNav", id);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.drawer {
  position: fixed;
  top: 52px;
  right: 0;
  left: 0;
  z-index: 1010;
  background-color: var(--app-body-bg);
}

.navs {
  display: flex;
  justify-content: center;
  padding: 0 8px 1rem;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 0.5rem;

  @media (max-width: 374.98px) {
    padding: 0;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  margin: 0.125rem;
  padding: 5px 12px;
  outline: none;
  font-size: 12px;
  font-weight: bold;
  text-decoration: none;
  color: var(--app-btn-color);
  touch-action: manipulation;
  background-color: var(--app-btn-gray);
  border-radius: 12px;

  &.active {
    color: var(--app-body-bg);

    svg {
      color: var(--app-body-bg);
    }
  }

  @media (max-width: 374.98px) {
    padding: 3px 10px;
    min-width: none;
    font-size: 11px;
  }
}

.nav-item-items {
  &.active {
    background-color: #42b983;
  }

  svg {
    color: #42b983;
  }
}

.nav-item-collection {
  &.active {
    background-color: #ff7626;
  }

  svg {
    color: #ff7626;
  }
}

.nav-item-special {
  &.active {
    background-color: #ab47bc;
  }

  svg {
    color: #ab47bc;
  }
}

.nav-item-wishlist {
  &.active {
    background-color: #ff617c;
  }

  svg {
    color: #ff617c;
  }
}

.nav-item-about {
  font-size: 14px;
  color: #ff617c;
}

.separator {
  padding: 0;
  margin: 0;
  width: 100%;
}
</style>
