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
import LZString from "lz-string";
import firebase from "./plugins/firebase";
import isEqual from "lodash/isEqual";
import { navs } from "./utils/nav.js";
import Drawer from "./components/Drawer.vue";
import Button from "./components/Button.vue";

const db = firebase.firestore();

export default {
  components: {
    Drawer,
    Button
  },
  data() {
    return {
      cloudSynctimer: null,
      isLoadComplete: null,
      updateIndex: null,
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
    user() {
      return this.$store.getters.user;
    },
    userName() {
      return this.$store.getters.userName;
    },
    isLogin() {
      return this.$store.getters.isLogin;
    },
    localCollected() {
      return this.$store.getters.localCollectedData;
    },
    localUpdateIndex() {
      return this.$store.getters.localUpdateIndex;
    },
    cloudCollected() {
      return this.$store.getters.cloudCollectedData;
    },
    cloudUpdateIndex() {
      return this.$store.getters.cloudUpdateIndex;
    }
  },
  watch: {
    user() {
      this.loadFirebaseData();
    },
    cloudUpdateIndex() {
      this.syncCollectedData();
    }
  },
  async created() {
    const self = this;
    await Promise.all([self.loadLocalStorageData()]);
    this.isLoadComplete = true;
    this.cloudSynctimer = setInterval(function() {
      if (self.updateIndex && self.updateIndex === self.localUpdateIndex) {
        self.syncCollectedData();
        self.$store.commit("updateHasUpdateData", false);
      } else {
        self.updateIndex = self.localUpdateIndex;
      }
    }, 3000);
  },
  mounted() {
    if (navigator.userAgent.indexOf("Android") > 0) {
      window.addEventListener("scroll", this.handleScroll);
    }
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    toggleDrawer() {
      this.$store.commit("toggleDrawer");
    },
    handleScroll: function() {
      const windowHeight = window.screen.height;
      const bodyEl = document.body;
      if (window.scrollY / windowHeight > 1) {
        bodyEl.classList.add("scrolled");
      } else {
        bodyEl.classList.remove("scrolled");
      }
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
    },
    loadFirebaseData: function() {
      const self = this;
      const user = this.user;
      if (user && user.uid) {
        db.collection("users")
          .doc(user.uid)
          .get()
          .then(function(doc) {
            if (doc.exists) {
              const data = doc.data();
              const collectedValue = data.collected || {};
              const collected = JSON.parse(
                LZString.decompressFromUTF16(collectedValue)
              );
              const updateIndex = data.updateIndex || 0;
              const userName = data.userName || user.displayName || null;
              const shareCategories = data.shareCategories || [];

              self.$store.commit("initCloudCollectedData", {
                collected,
                updateIndex
              });
              self.$store.commit("updateUserName", userName);
              self.$store.commit("updateShareCategories", shareCategories);
            } else {
              const userName = user.displayName || null;
              db.collection("users")
                .doc(user.uid)
                .set({
                  userName
                });
              self.$store.commit("updateUserName", userName);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    syncCollectedData: function() {
      if (!isEqual(this.localCollected, this.cloudCollected)) {
        if (this.localUpdateIndex > this.cloudUpdateIndex) {
          this.updateCloudData();
        } else {
          this.updateLocalData();
        }
      }
    },
    updateCloudData: function() {
      if (this.user && this.user.uid) {
        const updateIndex = this.localUpdateIndex;
        db.collection("users")
          .doc(this.user.uid)
          .update({
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
            collected: LZString.compressToUTF16(
              JSON.stringify(this.localCollected)
            ),
            updateIndex
          })
          .then(function() {})
          .catch(function() {});
        this.$store.commit("updateCloudCollectedData", {
          collected: this.localCollected,
          updateIndex
        });
      }
    },
    updateLocalData: function() {
      this.$store.commit("updateLocalCollectedData", {
        collected: this.cloudCollected,
        updateIndex: this.cloudUpdateIndex
      });
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
