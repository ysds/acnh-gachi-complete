<template>
  <div class="share">
    <PageToTop />
    <div class="view-btn-wrapper">
      <router-link to="/" class="flat-btn">
        自分のページを表示
      </router-link>
    </div>
    <h1 class="header">
      <span class="header-lg">{{ navText }}</span>
      <div class="header-sm" v-if="isLoaded">（{{ sharedUserName }}さん）</div>
    </h1>
    <div class="filter">
      <FilterUI
        :filter="filter"
        :currentNav="nav"
        :showSaleFilter="isShowSaleFilter"
        :showBatchAction="false"
        :showShareButton="false"
        @change="onChangeFilter"
      />
      <CollectedBar
        :totalValue="getTotalLength()"
        :value="getCollectedLength()"
      />
    </div>
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
    <div class="message">{{ message }}</div>
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
import FilterUI from "../components/FilterUI.vue";
import CollectedBar from "../components/CollectedBar.vue";
import PageToTop from "../components/PageToTop.vue";

const db = firebase.firestore();

export default {
  components: {
    Item,
    FilterUI,
    CollectedBar,
    PageToTop
  },
  data() {
    return {
      message: "データを読み込んでいます。",
      isLoaded: false,
      showItems: [],
      filter: {
        saleFilter: "0",
        collectedFilter: "0",
        viewMode: "tile"
      },
      renderStartDate: null
    };
  },
  computed: {
    sharedUid() {
      return this.$route.params.id;
    },
    sharedCollected() {
      return this.$store.getters.sharedCollected;
    },
    sharedUserName() {
      return this.$store.getters.sharedUserName;
    },
    nav() {
      return this.$route.params.category;
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
    navText: function() {
      return getNavText(this.nav);
    }
  },
  mounted() {
    if (this.sharedCollected === null) {
      this.loadOtherFirebaseData();
    } else {
      this.message = "";
      this.isLoaded = true;
      this.updateShowItems();
    }
  },
  methods: {
    loadOtherFirebaseData: function() {
      console.log("load");
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
            self.message = "";
            self.isLoaded = true;
            self.updateShowItems();
          } else {
            self.message =
              "データを読み込めませんでした。URL が間違えているか、データが存在しません。";
            self.isLoaded = true;
            self.$store.commit("updateSharedCollected", {});

            self.updateShowItems();
          }
        })
        .catch(function() {
          self.message = "データを読み込めませんでした。";
          self.isLoaded = true;
          self.$store.commit("updateSharedCollected", {});

          self.updateShowItems();
        });
    },
    getCollected: function(item) {
      return item.uniqueEntryId
        ? this.sharedCollected[item.uniqueEntryId]
        : this.sharedCollected[item.name];
    },
    onChangeFilter: function(activeFilter) {
      this.filter = activeFilter;
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
    updateShowItems: function() {
      const self = this;
      self.renderStartDate = new Date().getTime();
      const renderStartDate = self.renderStartDate;

      let result = filterItems({
        collected: self.sharedCollected,
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
  top: 12px;
}

.header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 1rem;
  margin-bottom: 0;
  font-size: 28px;
  font-weight: 700;
  word-break: break-all;
}

.header-lg {
  display: inline-flex;
}

.header-sm {
  margin: 0.5rem 0;
  font-size: 15px;
  color: #555;
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

.flat-btn {
  border: 1px solid #ccc;
  height: 32px;
  min-height: 32px;
  line-height: 32px;
}
</style>
