<template>
  <div class="home">
    <PageToTop />
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
        @close="onClickSearchBtn"
        @input="onInputSearchBox"
      />
    </div>
    <Nav
      :navs="navs"
      :active="nav"
      :pins="pins"
      @change="onChangeNav"
      v-if="!isSearchMode"
    />
    <FilterUI
      :filter="filter"
      :showSaleFilter="isShowSaleFilter"
      :showPinOption="isShowPinOption"
      :showShareButton="isLogin"
      :currentNav="nav"
      :pins="pins"
      @change="onChangeFilter"
      @clickBatchAction="onClickItemCheckBatchAction"
      @changePin="onChangePin"
      v-if="!isSearchMode"
    />
    <CollectedBar
      :totalValue="getTotalLength()"
      :value="getCollectedLength()"
      v-if="!isSearchMode"
    />
    <ul
      class="items"
      :class="{ tiles: filter.viewMode === 'tile' }"
      v-if="showItems && showItems.length > 0"
      v-show="!isOpenLogin"
    >
      <Item
        v-for="item in showItems"
        :item="item"
        :collected="getCollected(item)"
        :filter="filter"
        :isSearchMode="isSearchMode"
        :key="item.name + item.sourceSheet"
        :renderStartDate="renderStartDate"
        @change="onChangeItemCheck"
        @showModal="onShowModal"
      />
    </ul>
    <div v-if="!isLoadComplete" class="message loading">
      読み込み中...
    </div>
    <infinite-loading
      v-if="isLoadComplete !== null"
      :identifier="renderStartDate"
      :distance="2000"
      @infinite="loadMore"
    >
      <div slot="no-more"></div>
      <template slot="no-results">
        <div v-if="isSearchMode && searchText === ''" class="message"></div>
        <div v-else class="message">
          表示するアイテムがありません。
        </div>
      </template>
    </infinite-loading>
    <Modal :show="isShowModal" @close="isShowModal = false">
      <template v-if="modalItem">
        <template slot="header">{{ modalItem.displayName }}</template>
        <div slot="body"><ItemModalContent :modalItem="modalItem" /></div>
      </template>
    </Modal>
    <Login v-if="isOpenLogin" @close="isOpenLogin = false" />
  </div>
</template>

<script>
import {
  filterItems,
  navs,
  totalLength,
  collectedLength
} from "../utils/nav.js";

import Nav from "../components/Nav.vue";
import Login from "../components/Login.vue";
import Button from "../components/Button.vue";
import SearchBox from "../components/SearchBox.vue";
import FilterUI from "../components/FilterUI.vue";
import Item from "../components/Item.vue";
import Modal from "../components/Modal.vue";
import CollectedBar from "../components/CollectedBar.vue";
import PageToTop from "../components/PageToTop.vue";
import ItemModalContent from "../components/ItemModalContent.vue";

export default {
  name: "Collection",
  components: {
    Nav,
    Login,
    Button,
    SearchBox,
    FilterUI,
    Item,
    Modal,
    CollectedBar,
    PageToTop,
    ItemModalContent
  },
  data() {
    return {
      nav: "",
      filter: {
        saleFilter: null,
        collectedFilter: null,
        viewMode: null
      },
      showItems: [],
      resultItems: [],
      queueItems: [],
      isSearchMode: false,
      renderStartDate: new Date().getTime(),
      isLoadComplete: null,
      searchText: "",
      navs: navs,
      isOpenLogin: false,
      isShowModal: false,
      modalItem: null,
      pins: {}
    };
  },
  computed: {
    collected() {
      return this.$store.getters.localCollectedData;
    },
    user() {
      return this.$store.getters.user;
    },
    isLogin() {
      return this.$store.getters.isLogin;
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
    isShowPinOption: function() {
      if (this.nav) {
        const showNavs = ["special", "season"];
        for (let i = 0; i < showNavs.length; i++) {
          if (this.nav.indexOf(showNavs[i]) !== -1) return true;
        }
      }
      return false;
    }
  },
  async mounted() {
    await this.initNavFilter();
    this.updateShowItems();
  },
  methods: {
    initNavFilter: async function() {
      // Load data from localStrage
      const self = this;
      let [nav, filter, pins] = await Promise.all([
        self.$vlf.getItem("nav"),
        self.$vlf.getItem("filter"),
        self.$vlf.getItem("pins")
      ]);
      // Set saved active nav to 'null' if it isn't defined in the lates navs data
      if (nav) {
        let isDefinedNav = false;
        navs.forEach(link => {
          if (link.id === nav) isDefinedNav = true;
          if (link.subnavs) {
            link.subnavs.forEach(sublink => {
              if (sublink.id === nav) isDefinedNav = true;
            });
          }
        });
        if (!isDefinedNav) nav = null;
      }

      if (filter.saleFilter.match(/[012345]/g)) {
        filter.saleFilter = "all";
      }

      this.nav = nav || "housewares";
      this.filter = Object.assign(
        {
          saleFilter: "all",
          collectedFilter: "0",
          viewMode: "tile"
        },
        filter
      );
      this.pins = pins || {};
      this.updateNavOrder();
    },
    onChangeItemCheck: function(itemName, itemCollectedData) {
      this.$store.commit("updateLocalCollectedDataByItem", {
        itemName,
        itemCollectedData
      });
    },
    onClickItemCheckBatchAction: function(value) {
      const confirm = window.confirm(
        "本当にチェック状態を一括変更してもよろしいですか？"
      );
      if (!confirm) return;
      let items = [];
      let collectedArray = [];
      const resultItems = this.resultItems;
      for (let i = 0; i < resultItems.length; i++) {
        items.push(resultItems[i].uniqueEntryId || resultItems[i].name);
      }
      for (let i = 0; i < items.length; i++) {
        if (value === "allCollected") {
          if (resultItems[i].uniqueEntryId) {
            collectedArray.push("0");
          } else {
            collectedArray.push(
              "0123456789".slice(0, resultItems[i].variants.length)
            );
          }
        } else if (value === "allProvidable") {
          if (resultItems[i].uniqueEntryId) {
            collectedArray.push("A");
          } else {
            collectedArray.push(
              "ABCDEFGHIJ".slice(0, resultItems[i].variants.length)
            );
          }
        } else {
          collectedArray.push("");
        }
      }
      this.$store.commit("updateLocalCollectedDataBatch", {
        items,
        collectedArray
      });
    },
    onChangeNav: function(activeNav) {
      if (this.nav === activeNav) return;

      // Reset saleFilter
      const prevCategory = this.nav.split("-")[0];
      if (activeNav.indexOf(prevCategory) === -1) {
        this.filter.saleFilter = "all";
        this.$vlf.setItem("filter", this.filter);
      }

      this.nav = activeNav;
      this.updateShowItems();
      this.$vlf.setItem("nav", this.nav);
    },
    onChangeView: function() {
      const newViewMode = this.filter.viewMode === "tile" ? "list" : "tile";
      if (this.filter.viewMode === newViewMode) return;
      this.filter = Object.assign({}, this.filter, { viewMode: newViewMode });
      this.$vlf.setItem("filter", this.filter);
    },
    onChangeFilter: function(activeFilter) {
      this.filter = activeFilter;
      this.updateShowItems();
      this.$vlf.setItem("filter", this.filter);
    },
    onChangePin: function(currentNav, value) {
      this.pins[currentNav] = value;
      this.$vlf.setItem("pins", this.pins);
      this.updateNavOrder();
    },
    onClickSearchBtn: function() {
      this.isSearchMode = !this.isSearchMode;
      this.updateShowItems();
    },
    onInputSearchBox: function(text) {
      this.searchText = text;
      this.updateShowItems();
    },
    onShowModal: function(item) {
      this.isShowModal = true;
      this.modalItem = item;
    },
    getCollected: function(item) {
      return item.uniqueEntryId
        ? this.collected[item.uniqueEntryId]
        : this.collected[item.name];
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
        collected: Object.assign({}, this.collected),
        nav: this.nav,
        filter: Object.assign({}, this.filter, { collectedFilter: "3" }),
        isShowSaleFilter: this.isShowSaleFilter
      });
    },
    updateShowItems: function() {
      this.isLoadComplete = false;
      this.resultItems = filterItems({
        collected: this.collected,
        nav: this.nav,
        filter: this.filter,
        isSearchMode: this.isSearchMode,
        searchText: this.searchText,
        isShowSaleFilter: this.isShowSaleFilter
      });

      this.showItems = [];
      this.renderStartDate = new Date().getTime();
      this.queueItems = this.resultItems.slice();
    },
    loadMore($state) {
      const loadLength = this.isSearchMode ? 100 : 200;
      const queueLength = this.queueItems.length;
      const count = queueLength >= loadLength ? loadLength : queueLength;
      for (let i = 0; i < count; i++) {
        this.showItems.push(this.queueItems[i]);
      }

      if (queueLength > 0) {
        $state.loaded();
      } else {
        $state.complete();
      }

      this.queueItems.splice(0, count);
      this.isLoadComplete = true;
    },
    updateNavOrder: function() {
      // Re-order navs
      const navs = this.navs;
      for (let i = 0; i < navs.length; i++) {
        if (navs[i].subnavs) {
          navs[i].subnavs.sort(function(a, b) {
            if (a.order < b.order) return -1;
            if (a.order > b.order) return 1;
            return 0;
          });

          const pins = this.pins;
          navs[i].subnavs.sort(function(a, b) {
            if (pins[a.id] && !pins[b.id]) return -1;
            if (!pins[a.id] && pins[b.id]) return 1;
            return 0;
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  text-align: left;
  margin-bottom: 4rem;
  user-select: none;
}

.items {
  margin: 0;
  padding: 0;

  &.tiles {
    text-align: center;
  }
}

.message {
  margin-top: 3rem;
  padding: 0 1rem;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.6);
}

.loading {
  animation: delay 0s 0.2s forwards;
  opacity: 0;
}

@keyframes delay {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
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
