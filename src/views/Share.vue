<template>
  <div class="share">
    <PageToTop />
    <div class="view-btn-wrapper">
      <Button @click="isOpenLogin = true">
        <template v-if="isLogin">
          <img :src="myUser.photoURL" alt="Avatar" class="avatar" />
        </template>
        <template v-else-if="isLogin === false">
          ログイン
        </template>
      </Button>
      <router-link to="/" class="flat-btn back-btn">
        自分のページ
      </router-link>
    </div>
    <h1 v-if="!isShares" class="header">
      <span class="header-lg">{{ navText }}</span>
      <div class="header-sm" v-if="isLoaded">（{{ sharedUserName }}さん）</div>
    </h1>
    <div v-else>
      <div class="nav-wrapper">
        <nav class="nav">
          <button
            type="button"
            class="nav-item"
            :class="{ active: nav === category }"
            v-for="category in sharedShareCategories"
            :key="category"
            @click="changeNav(category)"
          >
            {{ getNavText(category) }}
          </button>
        </nav>
      </div>
      <div class="header-sm" v-if="isLoaded">（{{ sharedUserName }}さん）</div>
    </div>
    <div class="filter">
      <FilterUIShared
        :filter="filter"
        :showSaleFilter="isShowSaleFilter"
        @change="onChangeFilter"
      />
      <div v-show="parseInt(filter.collectedFilter, 10) < 5">
        <CollectedBar
          :totalValue="getTotalLength()"
          :value="getCollectedLength()"
        />
      </div>
    </div>
    <template v-if="!isLogin && parseInt(filter.collectedFilter, 10) > 4">
      <div class="description">
        ログインすると自分のデータと比較できます。
      </div>
    </template>
    <template v-else>
      <div class="description" v-show="filter.collectedFilter === '5'">
        相手が配布可で自分が未取得のアイテム
      </div>
      <div class="description" v-show="filter.collectedFilter === '6'">
        相手が未取得で自分が配布可のアイテム
      </div>
    </template>
    <div class="message" v-show="message !== ''">{{ message }}</div>
    <ul
      class="items"
      :class="{ tiles: filter.viewMode === 'tile' }"
      v-if="showItems && showItems.length > 0"
    >
      <Item
        v-for="item in showItems"
        :key="item.name + item.sourceSheet"
        :item="item"
        :collected="getCollected(item)"
        :filter="filter"
        :isStatic="true"
        :renderStartDate="renderStartDate"
      />
    </ul>
    <Login v-if="isOpenLogin" @close="isOpenLogin = false" />
  </div>
</template>

<script>
import LZString from "lz-string";
import firebase from "../plugins/firebase";
import {
  filterItems,
  totalLength,
  collectedLength,
  getNavText
} from "../utils/nav.js";

import Item from "../components/Item.vue";
import FilterUIShared from "../components/FilterUIShared.vue";
import CollectedBar from "../components/CollectedBar.vue";
import PageToTop from "../components/PageToTop.vue";
import Login from "../components/Login.vue";
import Button from "../components/Button.vue";

const db = firebase.firestore();

export default {
  components: {
    Item,
    FilterUIShared,
    CollectedBar,
    PageToTop,
    Login,
    Button
  },
  data() {
    return {
      nav: null,
      message: "データを読み込んでいます。",
      isLoaded: false,
      showItems: [],
      filter: {
        saleFilter: "0",
        collectedFilter: "0",
        viewMode: "tile"
      },
      renderStartDate: null,
      isOpenLogin: false
    };
  },
  computed: {
    sharedUid() {
      return this.$route.query.uid;
    },
    sharedCollected() {
      return this.$store.getters.sharedCollected;
    },
    sharedUserName() {
      return this.$store.getters.sharedUserName;
    },
    myUser() {
      return this.$store.getters.user;
    },
    myCollected() {
      return this.$store.getters.localCollectedData;
    },
    myUserName() {
      return this.$store.getters.userName;
    },
    isShowSaleFilter: function() {
      if (this.nav) {
        const showNavs = ["housewares", "walletc", "fashion"];
        for (let i = 0; i < showNavs.length; i++) {
          if (this.nav.indexOf(showNavs[i]) !== -1) return true;
        }
      }
      return false;
    },
    isLogin() {
      return this.$store.getters.isLogin;
    },
    navText: function() {
      return getNavText(this.nav);
    },
    myShareCategories() {
      return this.$store.getters.shareCategories;
    },
    sharedShareCategories() {
      return this.$store.getters.sharedShareCategories;
    },
    isShares() {
      return this.$route.name === "Shares";
    }
  },
  mounted() {
    if (!this.isShares) {
      this.nav = this.$route.params.category;
    }

    if (this.myUser && this.myUser.uid === this.sharedUid) {
      this.$store.commit("updateSharedCollected", this.myCollected);
      this.$store.commit("updateSharedUserName", this.myUserName);
      this.$store.commit("updateSharedShareCategories", this.myShareCategories);
      this.nav = this.myShareCategories[0];
      if (this.nav.length > 0) {
        this.message = "";
      } else {
        this.message = "データは非公開です。";
      }
      this.isLoaded = true;
      this.updateShowItems();
    } else if (this.sharedCollected === null) {
      this.loadOtherFirebaseData();
    } else {
      this.message = "";
      this.isLoaded = true;
      this.updateShowItems();
    }
  },
  methods: {
    loadOtherFirebaseData: function() {
      const self = this;
      db.collection("users")
        .doc(self.sharedUid)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            const collectedValue = doc.data().collected || {};
            const collected = JSON.parse(
              LZString.decompressFromUTF16(collectedValue)
            );
            self.$store.commit("updateSharedCollected", collected);
            self.$store.commit("updateSharedUserName", doc.data().userName);
            self.$store.commit(
              "updateSharedShareCategories",
              doc.data().shareCategories
            ) || [];
            self.message = "";
            self.isLoaded = true;
            self.nav = self.sharedShareCategories
              ? self.sharedShareCategories[0]
              : "";
            if (self.nav.length > 0) {
              self.message = "";
            } else {
              self.message = "データは非公開です。";
            }
            self.updateShowItems();
          } else {
            self.message =
              "データを読み込めませんでした。URL が間違えているか、データが存在しません。";
            self.isLoaded = true;
            self.$store.commit("updateSharedCollected", {});

            self.updateShowItems();
          }
        })
        .catch(function(e) {
          self.message = "データを読み込めませんでした。";
          self.isLoaded = true;
          self.$store.commit("updateSharedCollected", {});
          console.log(e);

          self.updateShowItems();
        });
    },
    getNavText(id) {
      return getNavText(id);
    },
    getCollected: function(item) {
      return item.uniqueEntryId
        ? this.sharedCollected[item.uniqueEntryId]
        : this.sharedCollected[item.name];
    },
    onChangeFilter: function(activeFilter) {
      this.filter = Object.assign({}, activeFilter);
      this.updateShowItems();
    },
    getTotalLength: function() {
      return totalLength({
        collected: {},
        nav: this.nav,
        filter: Object.assign({}, this.filter, { collectedFilter: "0" }),
        isShowSaleFilter: this.isShowSaleFilter
      });
    },
    getCollectedLength: function() {
      return collectedLength({
        collected: Object.assign({}, this.sharedCollected),
        nav: this.nav,
        filter: Object.assign({}, this.filter, { collectedFilter: "3" }),
        isShowSaleFilter: this.isShowSaleFilter
      });
    },
    changeNav(category) {
      this.nav = category;
      this.updateShowItems();
    },
    updateShowItems: function() {
      const self = this;
      self.renderStartDate = new Date().getTime();
      const renderStartDate = self.renderStartDate;

      let result = filterItems({
        collected: self.sharedCollected,
        myCollected: self.myCollected,
        nav: self.nav,
        filter: self.filter,
        isSearchMode: false,
        isShowSaleFilter: self.isShowSaleFilter,
        searchText: "",
        false: false
      });
      if (result.length < 50) {
        self.showItems = result;
        self.isSearchResultOverThreshold = false;
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        self.isSearchResultOverThreshold = false;

        self.showItems = [];
        for (let i = 0; i < 50; i++) {
          const item = result[i];
          self.showItems.push(item);
        }
        result.splice(0, 50);

        const showItems = result;
        const ite = (function*() {
          while (true) {
            const items = showItems.splice(0, 50);
            if (items.length <= 0 || self.renderStartDate > renderStartDate)
              break;
            yield setTimeout(() => {
              if (self.renderStartDate > renderStartDate) return;
              for (let len = items.length, i = 0; i < len; i++) {
                const item = items[i];
                self.showItems.push(item);
              }
              ite.next();
            });
          }
        })();
        ite.next();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.share {
  text-align: left;
  margin-bottom: 4rem;
  user-select: none;
}

.view-btn-wrapper {
  display: flex;
  align-items: center;
  position: absolute;
  right: 12px;
  top: 4px;

  > * {
    margin-left: 4px;
  }
}

.header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0;
  font-size: 28px;
  font-weight: 700;
  word-break: break-all;
}

.header-lg {
  display: inline-flex;
  padding: 0.1rem 0 0.1rem 1rem;
  color: #000;
}

.header-sm {
  margin: 0.5rem 0;
  font-size: 15px;
  font-weight: 700;
  color: #555;
  padding: 0.1rem 0.5rem;
}

.filter {
  margin-bottom: 1.5rem;
}

.items {
  margin: 0;
  padding: 0;

  &.tiles {
    text-align: center;
  }
}

.message {
  padding: 1rem;
  text-align: center;
}

.back-btn {
  border: 1px solid #ccc;
  height: 34px;
  min-height: 34px;
  line-height: 34px;
}

.description {
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  background-color: #eee;
  padding: 0.5rem;
  margin-top: -12px;
  margin-bottom: 14px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.nav-wrapper {
  display: flex;

  ~ .header-sm {
    margin-top: 0;
  }
}

.nav {
  display: flex;
  padding: 0.5rem;
  overflow-x: auto;
  line-height: 1;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.nav-item {
  padding: 0.1rem 0.5rem;
  font-size: 20px;
  font-weight: 600;
  border: 0;
  background-color: transparent;
  color: rgba(#000, 0.6);

  &:focus {
    outline: 0;
  }

  &.active {
    font-weight: 700;
    font-size: 28px;
    color: #000;
  }
}
</style>
