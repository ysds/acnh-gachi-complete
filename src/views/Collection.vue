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
      <div class="d-flex">
        <div class="toolbar">
          <ToolbarFilter
            :filter="filter"
            :activeNav="activeNav"
            @change="onChangeFilter"
          />
          <ToolbarShare v-if="isLogin" />
          <ToolbarPin :pins="pins" @changePin="onChangePin" />
          <ToolbarBatch
            @clickCopyName="onClickCopyName"
            @clickBatchAction="onClickItemCheckBatchAction"
          />
        </div>
      </div>
      <CollectedBar :totalValue="totalLength" :value="collectedLength" />
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
      v-if="isVersion && !isSearchMode"
      class="message"
      style="font-weight: 400; font-size: 12px;"
    >
      バージョンカテゴリは、「素材」や「消費アイテム」、「植物」などコレクション要素がないアイテムを含む、そのバージョンで追加されたすべてのアイテムを表示します。
    </div>
    <Modal :show="isShowModal" @close="isShowModal = false">
      <template v-if="modalItem">
        <template slot="header">{{ modalItemName }}</template>
        <div slot="body"><ItemModalContent :modalItem="modalItem" /></div>
      </template>
    </Modal>
    <portal-target name="shareModal"></portal-target>
    <portal-target name="batchModal"></portal-target>
    <Login v-if="isOpenLogin" @close="isOpenLogin = false" />
  </div>
</template>

<script>
import {
  filterItems,
  navs,
  totalLength,
  collectedLength,
  toDisplayItemName
} from "../utils/nav.js";
import { isAvailableFilter } from "../utils/filter";

import SubNav from "../components/SubNav.vue";
import Login from "../components/Login.vue";
import Button from "../components/Button.vue";
import SearchBox from "../components/SearchBox.vue";
import ToolbarFilter from "../components/ToolbarFilter.vue";
import ToolbarShare from "../components/ToolbarShare.vue";
import ToolbarPin from "../components/ToolbarPin.vue";
import ToolbarBatch from "../components/ToolbarBatch.vue";
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
    ToolbarFilter,
    ToolbarShare,
    ToolbarPin,
    ToolbarBatch,
    Item,
    Modal,
    CollectedBar,
    ItemModalContent
  },
  data() {
    return {
      filter: {
        typeFilter: null,
        collectedFilter: null,
        viewMode: null,
        order: null
      },
      showItems: [],
      resultItems: [],
      resultVariations: {},
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
    modalItemName() {
      return toDisplayItemName(this.modalItem, this.islandName);
    },
    isVersion() {
      if (this.activeNav) {
        if (this.activeNav.indexOf("versions") !== -1) return true;
      }
      return false;
    },
    totalLength() {
      if (this.activeNav === null || this.filter.typeFilter === null) {
        return 0;
      } else {
        return totalLength({
          nav: this.activeNav,
          typeFilter: this.filter.typeFilter
        });
      }
    },
    collectedLength() {
      if (this.activeNav === null || this.filter.typeFilter === null) {
        return 0;
      } else {
        return collectedLength({
          collected: Object.assign({}, this.collected),
          nav: this.activeNav,
          typeFilter: this.filter.typeFilter
        });
      }
    }
  },
  watch: {
    activeNav() {
      this.onChangeNav();
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

      if (filter && filter.typeFilter === null) {
        filter.typeFilter = "all";
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
      if (filter && filter.typeFilter && filter.typeFilter.match(/[012345]/g)) {
        filter.typeFilter = "all";
      }

      this.filter = Object.assign(
        {
          typeFilter: "all",
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

      this.resetTypeFilter();
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
      let self = this;
      function collectedValue(values, index) {
        return values.length > 0 ? values.charAt(index) : "";
      }
      function createVariationCollected(item, values) {
        const collected = self.disassembleCollected(item);
        if (
          self.filter.viewMode === "list" ||
          self.filter.collectedFilter === "0"
        ) {
          // リストビュー or タイルビューの「すべて」：全バリエーションを更新
          [...Array(item.variants.length).keys()].forEach(
            i => (collected[i] = collectedValue(values, i))
          );
        } else if (self.resultVariations[item.name]) {
          // タイルビューの「すべて」以外：表示中バリエーションを更新
          self.resultVariations[item.name].forEach(
            i => (collected[i] = collectedValue(values, i))
          );
        }
        return collected.join("");
      }
      this.resultItems.forEach(item => {
        items.push(item.uniqueEntryId || item.name);
        let values = "";
        if (value === "allCollected") {
          values = "0123456789";
        } else if (value === "allProvidable") {
          values = "ABCDEFGHIJ";
        }
        if (item.uniqueEntryId) {
          collectedArray.push(collectedValue(values, 0));
        } else {
          collectedArray.push(createVariationCollected(item, values));
        }
      });
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
    onChangeNav() {
      this.resetTypeFilter();
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
    disassembleCollected: function(item) {
      // collectedを分解して配列にする
      const collected = new Array(item.variants.length).fill("");
      (this.collected[item.name] || "").split("").forEach(c => {
        // 未取得アイテム以外の取得状態を設定
        collected[!isNaN(c) ? parseInt(c, 10) : c.charCodeAt() - 65] = c;
      });
      return collected;
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

      // 表示対象バリエーションのインデックスを保持する
      this.resultVariations = {};
      this.resultItems
        .filter(item => !item.uniqueEntryId)
        .map(item => {
          const collected = this.disassembleCollected(item);
          let indexes = [];
          if (this.filter.collectedFilter === "1") {
            // 取得済
            collected.forEach((c, i) => {
              if (c.match(/[0-9]/)) indexes.push(i);
            });
          } else if (this.filter.collectedFilter === "2") {
            // 配布可
            collected.forEach((c, i) => {
              if (c.match(/[A-J]/)) indexes.push(i);
            });
          } else if (this.filter.collectedFilter === "3") {
            // 取＋配
            collected.forEach((c, i) => {
              if (c.match(/[0-9A-J]/)) indexes.push(i);
            });
          } else if (this.filter.collectedFilter === "4") {
            // 未取得
            collected.forEach((c, i) => {
              if (c === "") indexes.push(i);
            });
          }
          if (indexes.length) this.resultVariations[item.name] = indexes;
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
    },
    resetTypeFilter() {
      if (isAvailableFilter(this.activeNav, this.filter.typeFilter)) {
        this.filter.typeFilter = "all";
        this.$vlf.setItem("filter", this.filter);
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

.toolbar {
  display: flex;
  margin: 0 auto;
  padding: 0 0 0.5rem 1rem;
  overflow-x: auto;
  line-height: 1;
  -webkit-overflow-scrolling: touch;

  &::after {
    content: "";
    padding-left: 1rem;
  }
}
</style>
