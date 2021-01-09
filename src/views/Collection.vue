<template>
  <div class="home">
    <div class="view-btn-wrapper" v-show="!isSearchMode && !isOpenDrawer">
      <Button @click="isOpenLogin = true">
        <template v-if="isLogin">
          <img :src="user.photoURL" alt="Avatar" class="avatar" />
        </template>
        <template v-else-if="isLogin === false">
          ログイン
        </template>
      </Button>
      <Button @click="onChangeView">
        <template v-if="filter.viewMode !== 'list'">
          <img src="../assets/list.svg" />
        </template>
        <template v-else>
          <img src="../assets/tile.svg" />
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
    <SubNav
      :navs="navs"
      :active="activeNav"
      :pins="pins"
      v-show="!isSearchMode && activeNav"
    />
    <div v-show="!isSearchMode && activeNav">
      <FilterUI
        :filter="filter"
        :showSaleFilter="isShowSaleFilter"
        :showPinOption="isShowPinOption"
        :showShareButton="isLogin"
        :currentNav="activeNav"
        :pins="pins"
        @change="onChangeFilter"
        @clickBatchAction="onClickItemCheckBatchAction"
        @clickCopyName="onClickCopyName"
        @changePin="onChangePin"
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
        :islandName="islandName"
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
    <div
      v-if="isVersion"
      class="message"
      style="font-weight: 400; font-size: 12px;"
    >
      バージョンカテゴリは、「素材」や「消費アイテム」、「植物」を含む、そのバージョンで追加されたすべてのアイテムを表示します。
    </div>
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
  collectedLength,
  isFilterBySaleType
} from "../utils/nav.js";

import SubNav from "../components/SubNav.vue";
import Login from "../components/Login.vue";
import Button from "../components/Button.vue";
import SearchBox from "../components/SearchBox.vue";
import FilterUI from "../components/FilterUI.vue";
import Item from "../components/Item.vue";
import Modal from "../components/Modal.vue";
import CollectedBar from "../components/CollectedBar.vue";
import ItemModalContent from "../components/ItemModalContent.vue";

export default {
  name: "Collection",
  components: {
    SubNav,
    Login,
    Button,
    SearchBox,
    FilterUI,
    Item,
    Modal,
    CollectedBar,
    ItemModalContent
  },
  data() {
    return {
      filter: {
        saleFilter: null,
        collectedFilter: null,
        viewMode: null,
        order: null
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
    isOpenDrawer() {
      return this.$store.getters.isOpenDrawer;
    },
    activeNav() {
      return this.$store.getters.activeNav;
    },
    collected() {
      return this.$store.getters.localCollectedData;
    },
    user() {
      return this.$store.getters.user;
    },
    isLogin() {
      return this.$store.getters.isLogin;
    },
    islandName() {
      return this.$store.getters.islandName;
    },
    isShowSaleFilter() {
      return isFilterBySaleType(this.activeNav);
    },
    isShowPinOption() {
      if (this.activeNav) {
        const showNavs = ["special", "season"];
        for (let i = 0; i < showNavs.length; i++) {
          if (this.activeNav.indexOf(showNavs[i]) !== -1) return true;
        }
      }
      return false;
    },
    isVersion() {
      if (this.activeNav) {
        if (this.activeNav.indexOf("versions") !== -1) return true;
      }
      return false;
    }
  },
  watch: {
    activeNav(nav, prev) {
      this.onChangeNav(nav, prev);
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

      if (filter && filter.saleFilter === null) {
        filter.saleFilter = "all";
      }
      if (filter && filter.collectedFilter === null) {
        filter.collectedFilter = "0";
      }
      if (filter && filter.viewMode === null) {
        filter.viewMode = "tile";
      }
      if (filter && filter.order === null) {
        filter.order = "name";
      }
      if (filter && filter.saleFilter && filter.saleFilter.match(/[012345]/g)) {
        filter.saleFilter = "all";
      }

      this.filter = Object.assign(
        {
          saleFilter: "all",
          collectedFilter: "0",
          viewMode: "tile",
          order: "name"
        },
        filter
      );
      this.pins = pins || {};

      if (this.activeNav === null) {
        // 保存されている nav 値が navs に存在しない場合、null にする
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
        this.changeNav(nav || "housewares-all");
      }
      this.updateNavOrder();
    },
    onChangeItemCheck: function(itemName, itemCollectedData) {
      this.$store.commit("updateLocalCollectedDataByItem", {
        itemName,
        itemCollectedData
      });
    },
    onClickItemCheckBatchAction: function(value) {
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
    onClickCopyName(nav) {
      let names = "";
      const resultItems = this.resultItems;
      for (let i = 0; i < resultItems.length; i++) {
        names += `${resultItems[i].displayName}\n`;
      }
      if (nav === "posters") {
        names = names.replace(/のポスター/g, "");
      } else if (nav === "photos") {
        names = names.replace(/のしゃしん/g, "");
      }
      this.$copyText(names);
    },
    onChangeNav: function(activeNav, prevNav) {
      // Reset saleFilter
      if (prevNav) {
        const prevCategory = prevNav.split("-")[0];
        if (activeNav.indexOf(prevCategory) === -1) {
          this.filter.saleFilter = "all";
          this.$vlf.setItem("filter", this.filter);
        }
      }
      this.updateShowItems();
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
    changeNav(nav) {
      this.$store.commit("changeNav", nav);
    },
    getCollected: function(item) {
      return item.uniqueEntryId
        ? this.collected[item.uniqueEntryId]
        : this.collected[item.name];
    },
    getTotalLength: function() {
      return totalLength({
        nav: this.activeNav,
        saleFilter: this.filter.saleFilter
      });
    },
    getCollectedLength: function() {
      return collectedLength({
        collected: Object.assign({}, this.collected),
        nav: this.activeNav,
        saleFilter: this.filter.saleFilter
      });
    },
    updateShowItems: function() {
      this.isLoadComplete = false;
      this.resultItems = filterItems({
        collected: this.collected,
        nav: this.activeNav,
        filter: this.filter,
        isSearchMode: this.isSearchMode,
        searchText: this.searchText
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
  position: fixed;
  top: 4px;
  right: 8px;
  z-index: 1011;
  display: flex;
  align-items: center;

  > * {
    margin-left: 4px;
  }
}

.search-wrapper {
  position: absolute;
  z-index: 1050;
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
