<template>
  <div id="app">
    <transition name="slide">
      <Drawer :navs="navs" :active="activeNav" v-show="isOpenDrawer" />
    </transition>
    <transition name="fade">
      <span class="backdrop" v-show="isOpenDrawer" @click="toggleDrawer" />
    </transition>
    <div class="nav">
      <Button @click="toggleDrawer">
        <img v-show="!isOpenDrawer" src="./assets/menu.svg" />
        <svg
          v-show="isOpenDrawer"
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 50 50"
        >
          <path
            fill="#42b983"
            d="M9.016 40.837a1.001 1.001 0 001.415-.001l14.292-14.309 14.292 14.309a1 1 0 001.416-1.413L26.153 25.129 40.43 10.836a1 1 0 10-1.415-1.413L24.722 23.732 10.43 9.423a1 1 0 10-1.415 1.413l14.276 14.293L9.015 39.423a1 1 0 00.001 1.414z"
          />
        </svg>
        <span class="name"><span>あつ森</span>ガチコンプ</span>
      </Button>
    </div>
    <router-view v-if="isLoadComplete" />
  </div>
</template>
<script>
import { navs } from "./utils/nav.js";
import { syncCollectedData, loadFirebaseData } from "./utils/db.js";
import Drawer from "./components/Drawer.vue";
import Button from "./components/Button.vue";

export default {
  components: {
    Drawer,
    Button
  },
  data() {
    return {
      isLoadComplete: null,
      navs
    };
  },
  computed: {
    activeNav() {
      return this.$store.getters.activeNav;
    },
    isOpenDrawer() {
      return this.$store.getters.isOpenDrawer;
    },
    isLogin() {
      return this.$store.getters.isLogin;
    },
    localCollected() {
      return this.$store.getters.localCollectedData;
    },
    cloudUpdateIndex() {
      return this.$store.getters.cloudUpdateIndex;
    },
    isDoneSyncCloudFirstTime() {
      return this.$store.getters.isDoneSyncCloudFirstTime;
    }
  },
  watch: {
    isLogin() {
      loadFirebaseData();
    },
    cloudUpdateIndex() {
      if (!this.isDoneSyncCloudFirstTime) {
        syncCollectedData();
        this.$store.commit("isDoneSyncCloudFirstTime", true);
      }
    }
  },
  async created() {
    await Promise.all([this.loadLocalStorageData()]);
    this.isLoadComplete = true;
  },
  methods: {
    toggleDrawer() {
      this.$store.commit("toggleDrawer");
    },
    loadLocalStorageData: async function() {
      const self = this;
      let [collected, updateIndex] = await Promise.all([
        self.$vlf.getItem("collected"),
        self.$vlf.getItem("updateIndex")
      ]);
      collected = collected || {};
      updateIndex = updateIndex || 0;
      self.$store.commit("initLocalCollectedData", { collected, updateIndex });
      return self.localCollected;
    }
  }
};
</script>

<style lang="scss" scoped>
#app {
  padding-top: 52px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1010;
  padding: 4px 8px;
  user-select: none;
  background-color: #fff;
  font-size: 15px;
  font-weight: bold;
}

.name {
  margin-left: 4px;
  color: #42b983;

  span {
    @media (max-width: 359.98px) {
      display: none;
    }
  }
}

.backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1009;
  background-color: rgba(0, 0, 0, 0.5);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.15s;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
