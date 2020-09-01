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
        @close="onClickSearchBtn"
        @input="onInputSearchBox"
      />
    </div>
    <!-- <div class="message">
      現在バグがあり、レシピがチェックできない状態です。申し訳ありませんが修正が完了するまでしばらくお待ちください。
    </div> -->
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
      @clickBatchAction="onClickItemCheckBatchAction"
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
    <div class="noitems" v-else-if="showItems === null">
      読み込み中...
    </div>
    <div class="noitems" v-else-if="!isSearchMode && showItems.length === 0">
      表示するアイテムがありません。
    </div>
    <div class="noitems" v-if="isSearchResultOverThreshold">
      検索結果が 100 件を超えたため、これ以降は省略されました。
    </div>
    <Modal :show="isShowModal" @close="isShowModal = false">
      <template v-if="modalItem">
        <template slot="header">{{ modalItem.displayName }}</template>
        <div slot="body">
          <div class="info">
            <div class="info-label info-1">買値</div>
            <div class="info-text" v-if="modalItem.buy">
              {{ getBuy(modalItem.buy) }}
            </div>
            <div class="info-text" v-if="modalItem.variants">
              {{ getBuy(modalItem.variants[0].buy) }}
            </div>
          </div>
          <div class="info">
            <div class="info-label info-2">売値</div>
            <div class="info-text" v-if="modalItem.buy">
              {{ modalItem.sell }}
            </div>
            <div class="info-text" v-if="modalItem.variants">
              {{ modalItem.variants[0].sell }}
            </div>
          </div>
          <div class="info">
            <div class="info-label info-3">入手</div>
            <div class="info-text" v-if="modalItem.sourceJa">
              {{ modalItem.sourceJa.join("、") }}
            </div>
            <div class="info-text" v-if="modalItem.variants">
              {{ modalItem.variants[0].sourceJa.join("、") }}
            </div>
          </div>
          <div class="info" v-if="modalItem.sourceNotesJa">
            <div class="info-label info-4">入手メモ</div>
            <div class="info-text">{{ modalItem.sourceNotesJa }}</div>
          </div>
        </div>
      </template>
    </Modal>
    <Login v-if="isOpenLogin" @close="isOpenLogin = false" />
  </div>
</template>

<script>
import itemsJson from "../assets/items.json";
import { filterItems, links } from "../utils/nav.js";

import Nav from "../components/Nav.vue";
import Login from "../components/Login.vue";
import Button from "../components/Button.vue";
import SearchBox from "../components/SearchBox.vue";
import FilterUI from "../components/FilterUI.vue";
import Item from "../components/Item.vue";
import Modal from "../components/Modal.vue";
import CollectedBar from "../components/CollectedBar.vue";

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
    CollectedBar
  },
  data() {
    return {
      nav: "",
      filter: {
        saleFilter: null,
        collectedFilter: null,
        viewMode: null
      },
      showItems: null,
      isSearchMode: false,
      renderStartDate: null,
      searchText: "",
      links: links,
      isSearchResultOverThreshold: false,
      isOpenLogin: false,
      isShowModal: false,
      modalItem: null
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
      let [nav, filter] = await Promise.all([
        self.$vlf.getItem("nav"),
        self.$vlf.getItem("filter")
      ]);
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
          saleFilter: "0",
          collectedFilter: "0",
          viewMode: "tile"
        },
        filter
      );
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
      const showItems = this.showItems;
      for (let i = 0; i < showItems.length; i++) {
        items.push(showItems[i].uniqueEntryId || showItems[i].name);
      }
      for (let i = 0; i < items.length; i++) {
        if (value === "allCollected") {
          if (showItems[i].uniqueEntryId) {
            collectedArray.push("0");
          } else {
            collectedArray.push(
              "0123456789".slice(0, showItems[i].variants.length)
            );
          }
        } else if (value === "allProvidable") {
          if (showItems[i].uniqueEntryId) {
            collectedArray.push("A");
          } else {
            collectedArray.push(
              "ABCDEFGHIJ".slice(0, showItems[i].variants.length)
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
    onClickSearchBtn: function() {
      this.isSearchMode = !this.isSearchMode;
      this.isSearchResultOverThreshold = false;
      this.updateShowItems();
    },
    onInputSearchBox: function(text) {
      this.searchText = text;
      if (text === "") {
        this.isSearchResultOverThreshold = false;
      }
      this.updateShowItems();
    },
    onShowModal: function(item) {
      this.isShowModal = true;
      this.modalItem = item;
    },
    getBuy: function(value) {
      if (value === -1 || value === null) return "非売品";
      return value;
    },
    getCollected: function(item) {
      return item.uniqueEntryId
        ? this.collected[item.uniqueEntryId]
        : this.collected[item.name];
    },
    getTotalLength: function() {
      const totalItems = filterItems(
        itemsJson,
        {}, // this.collected
        this.nav,
        Object.assign({}, this.filter, { collectedFilter: "0" }),
        this.isSearchMode,
        this.searchText,
        this.isShowSaleFilter
      );
      let result = 0;
      for (let i = 0; i < totalItems.length; i++) {
        if (totalItems[i].variants) {
          result += totalItems[i].variants.length;
        } else {
          result++;
        }
      }
      return result;
    },
    getCollectedLength: function() {
      const collectedItems = filterItems(
        itemsJson,
        this.collected,
        this.nav,
        Object.assign({}, this.filter, { collectedFilter: "3" }),
        this.isSearchMode,
        this.searchText,
        this.isShowSaleFilter
      );

      let result = 0;
      for (let i = 0; i < collectedItems.length; i++) {
        const item = collectedItems[i];
        const collected = this.collected;
        if (item.uniqueEntryId) {
          if (collected[item.uniqueEntryId]) result++;
        } else {
          const collectedData = collected[item.name] || "";
          const length = (collectedData.match(/[0-9A-J]/g) || []).length;
          result += length;
        }
      }
      return result;
    },
    updateShowItems: function() {
      const self = this;
      self.renderStartDate = new Date().getTime();
      const renderStartDate = self.renderStartDate;

      let result = filterItems(
        itemsJson,
        self.collected,
        self.nav,
        self.filter,
        self.isSearchMode,
        self.searchText,
        self.isShowSaleFilter
      );
      if (result.length < 50) {
        self.showItems = result;
        self.isSearchResultOverThreshold = false;
      } else if (self.isSearchMode && result.length > 100) {
        result = result.slice(0, 100);
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        self.isSearchResultOverThreshold = true;
        self.showItems = result;
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

.message {
  background-color: #f44;
  color: #fff;
  font-size: 14px;
  padding: 0.2rem 0.5rem;
}
</style>
