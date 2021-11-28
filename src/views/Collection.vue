<template>
  <div
    class="home"
    :class="{ isSearchMode: isSearchMode, isWishlistMode: isWishlistMode }"
  >
    <div class="view-btn-wrapper" v-show="!isSearchMode && !isOpenDrawer">
      <Button @click="isOpenLogin = true">
        <template v-if="isLogin">
          <img :src="user.photoURL" alt="Avatar" class="avatar" />
        </template>
        <template v-else-if="isLogin === false"> ログイン </template>
      </Button>
      <Button @click="onChangeView">
        <template v-if="filter.viewMode == 'list'">
          <img src="../assets/list.svg" />
        </template>
        <template v-else-if="filter.viewMode == 'tile'">
          <img src="../assets/tile.svg" />
        </template>
        <template v-else>
          <img src="../assets/tile2.svg" />
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
        @changeAdFilter="onChangeAdFilter"
      />
    </div>
    <div class="banner" v-if="isShowBanner" v-show="!isSearchMode">
      <div>
        「タイル（コンパクト）」表示モードや、動画を撮影してチェック状態をインポートできる機能をご存知でしょうか？
        詳しくは<router-link to="/about">使い方</router-link>をご覧ください。
      </div>
      <CloseButton white @click="onCloseBanner" />
    </div>
    <SubNav
      :navs="navs"
      :active="activeNav"
      :pins="pins"
      v-show="!isSearchMode && activeNav"
    />
    <div v-show="!isSearchMode && activeNav">
      <div
        class="d-flex"
        :style="{
          'margin-bottom': activeNav === 'exchange' ? '1rem' : null,
        }"
      >
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
      <CollectedBar
        v-if="activeNav !== 'exchange'"
        :totalValue="totalLength"
        :value="collectedLength"
      />
    </div>
    <ul
      class="items"
      :class="{
        tiles: filter.viewMode === 'tile' || filter.viewMode === 'tile2',
      }"
      v-if="showItems && showItems.length > 0"
      v-show="!isOpenLogin"
    >
      <Item
        v-for="item in showItems"
        :item="item"
        :collected="
          item.uniqueEntryId
            ? collected[item.uniqueEntryId]
            : collected[item.name]
        "
        :filter="filter"
        :isSearchMode="isSearchMode"
        :key="item.name + item.sourceSheet"
        :islandName="islandName"
        @change="onChangeItemCheck"
        @showModal="onShowModal"
        @updateWishlist="onUpdateWishlist"
      />
    </ul>
    <div v-if="!isLoadComplete" class="message loading">読み込み中...</div>
    <infinite-loading
      v-if="isLoadComplete !== null"
      :identifier="renderStartDate"
      :distance="2000"
      @infinite="loadMore"
    >
      <div slot="no-more"></div>
      <template slot="no-results">
        <div
          v-if="isSearchMode && searchText === '' && adFilterLength === 0"
          class="message"
        ></div>
        <div
          v-else-if="
            activeNav === 'exchange' && filter.exchangeType === 'wishlist'
          "
          class="message"
        >
          <p>欲しいものリストが登録されていません。</p>
          <p>
            アイテムを長押しして表示されるダイアログから、「欲しいものリスト」に追加できます。
          </p>
        </div>
        <div v-else class="message">表示するアイテムがありません。</div>
      </template>
    </infinite-loading>
    <div
      v-if="this.activeNav === 'other-all' && !isSearchMode"
      class="message"
      style="font-weight: 400; font-size: 12px"
    >
      ゲーム内の収納の「そのほか」と一致させるために、ここには「道具・グッズ」も含まれています。「道具・グッズ」だけを見たい場合は「道具・グッズ」カテゴリを参照してください。
    </div>
    <Modal :show="isShowModal" @close="isShowModal = false" closeButton>
      <template v-if="modalItem">
        <template slot="header">{{ modalItemName }}</template>
        <div slot="body">
          <ItemModalContent
            :modalItem="modalItem"
            :modalBodyIndex="modalBodyIndex"
            :modalPatternIndex="modalPatternIndex"
            :isShowExtraButton="true"
            :collected="
              modalItem.uniqueEntryId
                ? collected[modalItem.uniqueEntryId]
                : collected[modalItem.name]
            "
            :isCompactView="filter.viewMode === 'tile2'"
            @updateModalBodyIndex="modalBodyIndex = $event"
            @updateModalPatternIndex="modalPatternIndex = $event"
            @updateWishlist="onUpdateWishlist"
            @updateCollected="onChangeItemCheck"
          />
        </div>
      </template>
    </Modal>
    <div class="wishlist-mode" v-if="isWishlistMode">
      <div>
        <b>【欲しいもの一括チェックモード】</b>
        <div>チェックする代わりに欲しいものリストに追加/削除できます。</div>
      </div>
      <CloseButton white @click="onCloseWishlistMode" />
    </div>
    <portal-target name="shareModal"></portal-target>
    <portal-target name="batchModal"></portal-target>
    <Login v-if="isOpenLogin" @close="isOpenLogin = false" />
  </div>
</template>

<script>
import {
  filterItems,
  totalLength,
  collectedLength,
} from "../utils/filterItems.js";
import { navs } from "../utils/navs";
import { isAvailableFilter } from "../utils/filter";
import { toDisplayItemName } from "../utils/utils";

import SubNav from "../components/SubNav.vue";
import Login from "../components/Login.vue";
import Button from "../components/Button.vue";
import CloseButton from "../components/CloseButton.vue";
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
    CloseButton,
    SearchBox,
    ToolbarFilter,
    ToolbarShare,
    ToolbarPin,
    ToolbarBatch,
    Item,
    Modal,
    CollectedBar,
    ItemModalContent,
  },
  data() {
    return {
      filter: {
        version: null,
        typeFilter: null,
        collectedFilter: null,
        viewMode: null,
        order: null,
      },
      showItems: [],
      resultItems: [],
      queueItems: [],
      renderStartDate: new Date().getTime(),
      isLoadComplete: null,
      searchText: "",
      navs: navs,
      isOpenLogin: false,
      isShowModal: false,
      modalItem: {},
      modalBodyIndex: 0,
      modalPatternIndex: 0,
      pins: {},
      isShowBanner: false,
      adFilters: {},
    };
  },
  computed: {
    isSearchMode() {
      return this.$store.getters.isSearchMode;
    },
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
    totalLength() {
      if (this.activeNav === null || this.filter.typeFilter === null) {
        return 0;
      } else {
        return totalLength({
          nav: this.activeNav,
          typeFilter: this.filter.typeFilter,
          version: this.filter.version,
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
          typeFilter: this.filter.typeFilter,
          version: this.filter.version,
        });
      }
    },
    wishlist() {
      return this.$store.getters.wishlist;
    },
    isWishlistMode() {
      return this.$store.getters.isWishlistMode;
    },
    stocklist() {
      return this.$store.getters.stocklist;
    },
    adFilterLength() {
      return Object.values(this.adFilters).filter((filter) => filter).length;
    },
  },
  watch: {
    activeNav(newValue, oldValue) {
      if (newValue === "exchange" || oldValue === "exchange") {
        this.filter.exchangeType = "wishlist";
        this.filter.collectedFilter = "0";
        this.$vlf.setItem("filter", this.filter);
      }
      if (oldValue !== null) {
        this.onChangeNav();
      }
    },
    islandName(newValue, oldValue) {
      // たぬきマイレージのみ島名反映後にソートさせたいため表示更新
      if (
        oldValue !== null &&
        this.activeNav === "achievements" &&
        this.filter &&
        this.filter.order === "name"
      ) {
        this.updateShowItems();
      }
    },
  },
  async mounted() {
    await this.initNavFilter();
    await this.initIslandName();
    await this.showBanner();
    this.updateShowItems();
  },
  methods: {
    initNavFilter: async function () {
      // Load data from localStrage
      const self = this;
      let [nav, filter, pins] = await Promise.all([
        self.$vlf.getItem("nav"),
        self.$vlf.getItem("filter"),
        self.$vlf.getItem("pins"),
      ]);

      if (filter && filter.version === null) {
        filter.version = false;
      }
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
          version: false,
          typeFilter: "all",
          collectedFilter: "0",
          viewMode: "tile",
          order: "name",
          exchangeType: "wishlist",
        },
        filter
      );
      this.pins = pins || {};

      if (this.activeNav === null) {
        // 保存されている nav 値が navs に存在しない場合、null にする
        if (nav) {
          let isDefinedNav = false;
          navs.forEach((link) => {
            if (link.id === nav) isDefinedNav = true;
            if (link.subnavs) {
              link.subnavs.forEach((sublink) => {
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
    async initIslandName() {
      const islandName = await this.$vlf.getItem("islandName");
      this.$store.commit("updateIslandName", islandName);
    },
    async showBanner() {
      this.isShowBanner = await this.$vlf.getItem("isShowBanner");
      if (this.isShowBanner === null) this.isShowBanner = true;
    },
    onCloseBanner() {
      this.isShowBanner = false;
      this.$vlf.setItem("isShowBanner", false);
    },
    onCloseWishlistMode() {
      this.$store.commit("toggleWishlistMode");
    },
    onChangeItemCheck: function (itemName, itemCollectedData) {
      this.$store.commit("updateLocalCollectedDataByItem", {
        itemName,
        itemCollectedData,
      });
    },
    onClickItemCheckBatchAction: function (value) {
      let items = [];
      let collectedArray = [];
      let self = this;
      function collectedValue(values, index) {
        return values.length > 0 ? values.charAt(index) : "";
      }
      function createVariationCollected(item, values) {
        const collected = self.disassembleCollected(item);

        let matchedVariants = "0123456789"
          .substring(0, item.variants.length)
          .split("");

        if (
          (self.filter.viewMode === "tile" ||
            self.filter.viewMode === "tile2") &&
          item.matchedVariants
        ) {
          matchedVariants = item.matchedVariants;
        }

        matchedVariants.forEach(
          (i) => (collected[i] = collectedValue(values, i))
        );
        return collected.join("");
      }
      this.resultItems.forEach((item) => {
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
        collectedArray,
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
    onChangeView: function () {
      let newViewMode;
      if (this.filter.viewMode === "list") {
        newViewMode = "tile";
      } else if (this.filter.viewMode === "tile") {
        newViewMode = "tile2";
      } else {
        newViewMode = "list";
      }
      if (this.filter.viewMode === newViewMode) return;
      this.filter = Object.assign({}, this.filter, { viewMode: newViewMode });
      this.$vlf.setItem("filter", this.filter);
    },
    onChangeFilter: function (activeFilter) {
      this.filter = activeFilter;
      this.updateShowItems();
      this.$vlf.setItem("filter", this.filter);
    },
    onChangePin: function (currentNav, value) {
      this.pins[currentNav] = value;
      this.$vlf.setItem("pins", this.pins);
      this.updateNavOrder();
    },
    onClickSearchBtn: function () {
      this.$store.commit("isSearchMode", !this.isSearchMode);
      this.updateShowItems();
    },
    onInputSearchBox: function (text) {
      this.searchText = text;
      this.updateShowItems();
    },
    onChangeAdFilter(filters) {
      this.adFilters = filters;
      this.updateShowItems();
    },
    onShowModal: function (item, index) {
      this.modalBodyIndex = index;
      this.modalPatternIndex = 0;
      this.modalItem = item;
      this.isShowModal = true;
    },
    onUpdateWishlist() {
      if (this.activeNav === "exchange") {
        this.updateShowItems();
      }
      this.isShowModal = false;
    },
    changeNav(nav) {
      this.$store.commit("changeNav", nav);
    },
    disassembleCollected: function (item) {
      // collectedを分解して配列にする
      const collected = new Array(item.variants.length).fill("");
      (this.collected[item.name] || "").split("").forEach((c) => {
        // 未取得アイテム以外の取得状態を設定
        collected[!isNaN(c) ? parseInt(c, 10) : c.charCodeAt() - 65] = c;
      });
      return collected;
    },
    updateShowItems: function () {
      this.isLoadComplete = false;
      this.resultItems = filterItems({
        collected: this.collected,
        nav: this.activeNav,
        filter: this.filter,
        isSearchMode: this.isSearchMode,
        searchText: this.searchText,
        adFilters: this.adFilters,
        islandName: this.islandName,
        updateMatchedVariants: true,
        wishlist: this.wishlist,
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
    updateNavOrder: function () {
      // Re-order navs
      const navs = this.navs;
      for (let i = 0; i < navs.length; i++) {
        if (navs[i].subnavs) {
          navs[i].subnavs.sort(function (a, b) {
            if (a.order < b.order) return -1;
            if (a.order > b.order) return 1;
            return 0;
          });

          const pins = this.pins;
          navs[i].subnavs.sort(function (a, b) {
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
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  text-align: left;
  margin-bottom: 4rem;
  user-select: none;

  &.isSearchMode {
    padding-top: 100px;
  }

  &.isWishlistMode {
    margin-bottom: 7rem;
  }
}

.items {
  margin: 0;
  padding: 0;
  background-color: #fff;

  &.tiles {
    text-align: center;
  }

  &.isSearchMode {
    position: relative;
    z-index: 1010;
    padding-top: 50px;
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
  top: 4px;
  right: 12px;
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

.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem;
  padding: 0.75rem;
  background-color: #007bff;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  text-align: center;

  a {
    font-weight: bold;
    color: #fff;
    text-decoration: underline;
  }
}

.wishlist-mode {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem;
  padding: 0.75rem;
  background-color: #007bff;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
}
</style>
