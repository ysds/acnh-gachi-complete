<template>
  <div class="home">
    <div class="view-btn-wrapper" v-show="!isSearchMode">
      <Button @click="isOpenLogin = true">
        <template v-if="isLogin">
          <img :src="user.photoURL" alt="Avatar" class="avatar" />
        </template>
        <template v-else-if="isLogin === false">
          ログイン
        </template>
      </Button>
      <Button @click="onChangeView">
        <template v-if="filter.viewMode !== 'tile'">
          <img src="../assets/tile.svg" />
        </template>
        <template v-else>
          <img src="../assets/list.svg" />
        </template>
      </Button>
      <Button @click="onClickSearchBtn">
        <img src="../assets/search.svg" />
      </Button>
    </div>
    <div class="search-wrapper" v-show="isSearchMode">
      <SearchBox
        :searchText="searchText"
        :isSearchMode="isSearchMode"
        @click="onClickSearchBtn"
        @input="onInputSearchBox"
      />
    </div>
    <Nav
      :links="links"
      :active="nav"
      @change="onChangeNav"
      v-if="!isSearchMode"
    />
    <FilterUI
      :filter="filter"
      :showSaleFilter="isShowSaleFilter"
      @change="onChangeFilter"
      v-if="!isSearchMode"
    />
    <ul
      class="items"
      :class="{ tiles: filter.viewMode === 'tile' }"
      v-if="showItems.length > 0"
      v-show="!isOpenLogin"
    >
      <Item
        v-for="item in showItems"
        :item="item"
        :collected="collected[item.uniqueEntryId] || collected[item.name]"
        :viewMode="filter.viewMode"
        :key="item.name + item.sourceSheet"
        @change="onChangeItemCheck"
      />
    </ul>
    <div class="noitems" v-else-if="!isSearchMode">
      表示するアイテムがありません。
    </div>
    <div class="noitems" v-if="isSearchResultOverThreshold">
      検索結果が 100 件を超えたため、これ以降は省略されました。
    </div>
    <Login v-if="isOpenLogin" @close="isOpenLogin = false" />
  </div>
</template>

<script>
import LZString from "lz-string";

import items from "../assets/items.json";
import firebase from "../plugins/firebase";
import { filterItems, links } from "../utils/nav.js";

import Nav from "../components/Nav.vue";
import Login from "../components/Login.vue";
import Button from "../components/Button.vue";
import SearchBox from "../components/SearchBox.vue";
import FilterUI from "../components/FilterUI.vue";
import Item from "../components/Item.vue";

const db = firebase.firestore();
db.enablePersistence({ synchronizeTabs: true });

export default {
  name: "Collection",
  components: {
    Nav,
    Login,
    Button,
    SearchBox,
    FilterUI,
    Item
  },
  data() {
    return {
      collected: {},
      nav: "",
      filter: {
        sale: null,
        collected: null,
        viewMode: null
      },
      isSearchMode: false,
      searchText: "",
      links: links,
      isSearchResultOverThreshold: false,
      isOpenLogin: false
    };
  },
  // TODO データ読み込みここまで
  computed: {
    user() {
      return this.$store.getters.user;
    },
    isLogin() {
      return this.$store.getters.isLogin;
    },
    showItems: function() {
      let result = filterItems(
        items,
        this.collected,
        this.nav,
        this.filter,
        this.isSearchMode,
        this.searchText,
        this.isShowSaleFilter
      );
      if (this.isSearchMode && result.length > 100) {
        result = result.slice(0, 99);
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.isSearchResultOverThreshold = true;
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.isSearchResultOverThreshold = false;
      }
      return result;
    },
    isShowSaleFilter: function() {
      if (this.nav) {
        const showNavs = ["housewares", "walletc", "fashion"];
        for (let i = 0; i < showNavs.length; i++) {
          if (this.nav.indexOf(showNavs[i]) !== -1) return true;
        }
      }
      return false;
    }
  },
  // TODO データ読み込みここから
  watch: {
    user() {
      // Load from firestore
      const self = this;
      if (this.user && this.user.uid) {
        db.collection("users")
          .doc(this.user.uid)
          .get()
          .then(function(doc) {
            if (doc.exists) {
              const collectedValue = doc.data().collected || {};
              self.collected = JSON.parse(
                LZString.decompressFromUTF16(collectedValue)
              );
            } else {
              // doc.data() will be undefined in this case
            }
          })
          .catch(function() {});
      }
    }
  },
  async mounted() {
    // Load data from localStrage
    const self = this;
    let [collected, nav, filter] = await Promise.all([
      self.$vlf.getItem("collected"),
      self.$vlf.getItem("nav"),
      self.$vlf.getItem("filter")
    ]);
    this.collected = collected || {};
    // Check defined nav
    if (nav) {
      let isDefinedNav = false;
      links.forEach(link => {
        if (link.id === nav) isDefinedNav = true;
        if (link.subnavs) {
          link.subnavs.forEach(sublink => {
            if (sublink.id === nav) isDefinedNav = true;
          });
        }
      });
      if (!isDefinedNav) nav = null;
    }
    this.nav = nav || "housewares";
    this.filter = Object.assign(
      {
        sale: "0",
        collected: "0",
        viewMode: "tile"
      },
      filter
    );
  },
  methods: {
    onChangeItemCheck: function(name, collected) {
      if (collected === "") {
        delete this.collected[name];
      } else {
        this.collected[name] = collected;
      }
      this.$vlf.setItem("collected", this.collected);
    },
    onChangeNav: function(activeNav) {
      this.nav = activeNav;
      this.$vlf.setItem("nav", this.nav);
      // TODO データ保存ここから
      if (this.user && this.user.uid) {
        db.collection("users")
          .doc(this.user.uid)
          .set({
            collected: LZString.compressToUTF16(JSON.stringify(this.collected))
          })
          .then(function() {})
          .catch(function() {});
      }
      // TODO データ保存ここまで
    },
    onChangeView: function() {
      const newViewMode = this.filter.viewMode === "tile" ? "list" : "tile";
      console.log(newViewMode);
      this.filter = Object.assign({}, this.filter, { viewMode: newViewMode });
      this.$vlf.setItem("filter", this.filter);
    },
    onChangeFilter: function(activeFilter) {
      this.filter = activeFilter;
      this.$vlf.setItem("filter", this.filter);
    },
    onClickSearchBtn: function() {
      this.isSearchMode = !this.isSearchMode;
      this.isSearchResultOverThreshold = false;
    },
    onInputSearchBox: function(text) {
      this.searchText = text;
      if (text === "") {
        this.isSearchResultOverThreshold = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  text-align: left;
  margin-bottom: 4rem;
}
.items {
  margin: 0;
  padding: 0;

  &.tiles {
    text-align: center;
  }
}

.noitems {
  margin-top: 3rem;
  padding: 0 1rem;
  text-align: center;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.6);
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

.search-wrapper {
  position: absolute;
  right: 12px;
  top: 4px;
  left: 12px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
</style>
