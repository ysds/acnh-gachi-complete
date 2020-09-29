<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">あつ森ガチコンプ</router-link>
    </div>
    <router-view />
  </div>
</template>
<script>
import LZString from "lz-string";
import firebase from "./plugins/firebase";
import isEqual from "lodash/isEqual";

const db = firebase.firestore();

export default {
  data() {
    return {
      cloudSynctimer: null,
      updateIndex: null
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
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
    this.cloudSynctimer = setInterval(function() {
      if (self.updateIndex && self.updateIndex === self.localUpdateIndex) {
        self.syncCollectedData();
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

              self.$store.commit("initCloudCollectedData", {
                collected,
                updateIndex,
                userName
              });
            } else {
              db.collection("users")
                .doc(user.uid)
                .set({});
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

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 1.05rem 1rem;
  user-select: none;

  a {
    font-weight: bold;
    color: #42b983;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
