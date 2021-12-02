<template>
  <div class="share">
    <div class="view-btn-wrapper" v-show="!isOpenDrawer">
      <Button @click="isOpenLogin = true">
        <template v-if="isLogin">
          <img :src="myUser.photoURL" alt="Avatar" class="avatar" />
        </template>
        <template v-else-if="isLogin === false"> ログイン </template>
      </Button>
    </div>
    <h1 v-if="!isShares" class="heading" :key="navText">
      {{ navText }}
    </h1>
    <h1 v-else-if="sharedShareCategories.length === 0" class="heading" key="all">
      全取得状況
    </h1>
    <div v-else class="nav-wrapper" key="shares">
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
    <SharedUserName
      v-if="isLoaded"
      :sharedUserName="sharedUserName"
      :sharedIslandName="sharedIslandName"
      style="padding: 0.5rem 1rem"
    />
    <div
      class="d-flex"
      :style="{
        'margin-bottom': nav === 'exchange' ? '1rem' : null,
      }"
    >
      <div class="toolbar">
        <ToolbarFilter
          isShareView
          :filter="filter"
          :activeNav="nav"
          @change="onChangeFilter"
        />
      </div>
    </div>
    <div
      v-show="parseInt(filter.collectedFilter, 10) <= 4 && nav !== 'exchange'"
      class="mb-5"
    >
      <CollectedBar :totalValue="totalLength" :value="collectedLength" />
    </div>
    <div v-show="parseInt(filter.collectedFilter, 10) > 4" class="description">
      <div v-if="!isLogin">ログインすると自分のデータと比較できます。</div>
      <div v-show="filter.collectedFilter === '5'">
        相手が配布可で自分が未取得のアイテム
      </div>
      <div v-show="filter.collectedFilter === '6'">
        相手が未取得で自分が配布可のアイテム
      </div>
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
        :isShared="isShared"
        :islandName="sharedIslandName"
        @showModal="onShowModal"
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
        <div class="message">{{ message }}</div>
      </template>
    </infinite-loading>
    <Modal :show="isShowModal" @close="isShowModal = false" closeButton>
      <template v-if="modalItem">
        <template slot="header">{{ modalItemName }}</template>
        <div slot="body">
          <ItemModalContent
            :modalItem="modalItem"
            :modalBodyIndex="modalBodyIndex"
            :modalPatternIndex="modalPatternIndex"
            @updateModalBodyIndex="modalBodyIndex = $event"
            @updateModalPatternIndex="modalPatternIndex = $event"
          />
        </div>
      </template>
    </Modal>
    <Login v-if="isOpenLogin" @close="isOpenLogin = false" />
  </div>
</template>

<script>
import LZString from "lz-string";
import firebase from "../plugins/firebase";
import {
  filterItems,
  totalLength,
  collectedLength
} from "../utils/filterItems";
import { navs, getNavText } from "../utils/navs";
import { isAvailableFilter } from "../utils/filter";
import { toDisplayItemName } from "../utils/utils";
import { syncData } from "../utils/db.js";

import Item from "../components/Item.vue";
import ToolbarFilter from "../components/ToolbarFilter.vue";
import CollectedBar from "../components/CollectedBar.vue";
import Login from "../components/Login.vue";
import Button from "../components/Button.vue";
import Modal from "../components/Modal.vue";
import ItemModalContent from "../components/ItemModalContent.vue";
import SharedUserName from "../components/SharedUserName.vue";

const db = firebase.firestore();

export default {
  components: {
    Item,
    ToolbarFilter,
    CollectedBar,
    Login,
    Button,
    Modal,
    ItemModalContent,
    SharedUserName,
  },
  data() {
    return {
      nav: null,
      filter: {
        version: false,
        typeFilter: "all",
        collectedFilter: "0",
        viewMode: "tile",
        order: "id",
        exchangeType: "wishlist",
      },
      showItems: [],
      resultItems: [],
      queueItems: [],
      renderStartDate: new Date().getTime(),
      isLoadComplete: null,
      isLoaded: false,
      isOpenLogin: false,
      isShowModal: false,
      modalItem: {},
      modalBodyIndex: 0,
      modalPatternIndex: 0,
      message: "",
    };
  },
  computed: {
    isShared() {
      return this.filter.collectedFilter !== "6";
    },
    isOpenDrawer() {
      return this.$store.getters.isOpenDrawer;
    },
    sharedUid() {
      return this.$route.query.uid;
    },
    sharedCollected() {
      return this.$store.getters.sharedCollected;
    },
    sharedUserName() {
      return this.$store.getters.sharedUserName;
    },
    sharedIslandName() {
      return this.$store.getters.sharedIslandName;
    },
    sharedShareCategories() {
      const sharedShareCategories =
        this.$store.getters.sharedShareCategories || [];

      let correctOrder = [];
      navs.forEach((nav) => {
        if (nav.subnavs) {
          nav.subnavs.forEach((subnav) => {
            correctOrder.push(subnav.id);
          });
        } else {
          correctOrder.push(nav.id);
        }
      });
      correctOrder = correctOrder.filter(
        (category) => category !== "season-snowboy"
      );
      let reOrder = [];
      correctOrder.forEach((id) => {
        if (sharedShareCategories.includes(id)) {
          reOrder.push(id);
        }
      });

      return reOrder;
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
    myShareCategories() {
      return this.$store.getters.shareCategories;
    },
    isLogin() {
      return this.$store.getters.isLogin;
    },
    modalItemName() {
      return toDisplayItemName(this.modalItem, this.sharedIslandName);
    },
    navText() {
      return getNavText(this.nav);
    },
    isShares() {
      return this.$route.name === "Shares";
    },
    totalLength() {
      return totalLength({
        nav: this.nav,
        typeFilter: this.filter.typeFilter,
        version: this.filter.version,
      });
    },
    collectedLength() {
      return collectedLength({
        collected: Object.assign({}, this.sharedCollected),
        nav: this.nav,
        typeFilter: this.filter.typeFilter,
        version: this.filter.version,
      });
    },
    isDoneSyncCloudFirstTime() {
      return this.$store.getters.isDoneSyncCloudFirstTime;
    },
    sharedWishlist() {
      return this.$store.getters.sharedWishlist;
    },
  },
  mounted() {
    this.loadOtherFirebaseData();

    // シェアページを直接開いたときは同期処理を実行しないが、
    // ブラウザナビゲーションなどシェアダイアログを通らないケースを考慮
    if (this.isDoneSyncCloudFirstTime) {
      syncData();
    }
  },
  watch: {
    myCollected() {
      const collectedFilter = this.filter.collectedFilter;
      if (collectedFilter === "5" || collectedFilter === "6") {
        this.updateShowItems;
      }
    },
  },
  methods: {
    loadOtherFirebaseData: function () {
      const self = this;
      db.collection("users")
        .doc(self.sharedUid)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            const data = doc.data();
            const collectedValue = data.collected || "";
            const collected = JSON.parse(
              LZString.decompressFromUTF16(collectedValue)
            );
            self.$store.commit("updateSharedCollected", collected);
            self.$store.commit("updateSharedUserName", data.userName);
            self.$store.commit("updateSharedIslandName", data.islandName);
            self.$store.commit(
              "updateSharedShareCategories",
              data.shareCategories
            ) || [];

            const wishlistValue = data.wishlist || "";
            const wishlist = JSON.parse(
              LZString.decompressFromUTF16(wishlistValue)
            );
            self.$store.commit("updateSharedWishlist", wishlist);

            const stocklistValue = data.stocklist || "";
            const stocklist = JSON.parse(
              LZString.decompressFromUTF16(stocklistValue)
            );
            self.$store.commit("updateSharedStocklist", stocklist);

            self.finishMounted(self.sharedShareCategories);
          } else {
            self.message =
              "データを読み込めませんでした。URL が間違えているか、データが存在しません。";
            self.isLoaded = true;
            self.$store.commit("updateSharedCollected", {});
            self.updateShowItems();
          }
        })
        .catch(function (e) {
          self.message = "データを読み込めませんでした。";
          self.isLoaded = true;
          self.$store.commit("updateSharedCollected", {});
          console.log(e);

          self.updateShowItems();
        });
    },
    finishMounted(shareCategories) {
      if (!this.isShares) {
        this.nav = this.$route.params.category;
      } else {
        this.nav =
          shareCategories && shareCategories.length > 0
            ? shareCategories[0]
            : "";
      }
      if (this.nav && this.nav.length > 0) {
        this.message = "";
      } else {
        this.message = "データは非公開です。";
      }
      this.isLoaded = true;
      this.updateShowItems();
    },
    getNavText(id) {
      return getNavText(id);
    },
    getCollected: function (item) {
      return item.uniqueEntryId
        ? this.sharedCollected[item.uniqueEntryId]
        : this.sharedCollected[item.name];
    },
    getMyCollected: function (item) {
      return item.uniqueEntryId
        ? this.myCollected[item.uniqueEntryId]
        : this.myCollected[item.name];
    },
    onChangeFilter: function (activeFilter) {
      this.filter = Object.assign({}, activeFilter);
      this.updateShowItems();
    },
    onShowModal: function (item, index) {
      this.modalBodyIndex = index;
      this.modalPatternIndex = 0;
      this.modalItem = item;
      this.isShowModal = true;
    },
    changeNav(category) {
      // Reset typeFilter
      if (isAvailableFilter(this.activeNav, this.filter.typeFilter)) {
        this.filter.typeFilter = "all";
      }
      this.nav = category;
      this.updateShowItems();
    },
    updateShowItems: function () {
      this.isLoadComplete = false;
      this.resultItems = filterItems({
        collected: this.sharedCollected,
        myCollected: this.myCollected,
        nav: this.nav,
        filter: this.filter,
        isSearchMode: false,
        searchText: "",
        false: false,
        islandName: this.sharedIslandName,
        updateMatchedVariants: true,
        wishlist: this.sharedWishlist,
      });

      this.showItems = [];
      this.renderStartDate = new Date().getTime();
      this.queueItems = this.resultItems.slice();
    },
    loadMore($state) {
      const loadLength = 200;
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
  },
};
</script>

<style lang="scss" scoped>
.share {
  text-align: left;
  margin-bottom: 4rem;
  user-select: none;
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

.heading {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0;
  font-size: 28px;
  font-weight: 700;
  word-break: break-all;
  padding: 0 1rem;
  color: #000;
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

.toolbar {
  margin: 0 auto;
}

.description {
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  background-color: #eee;
  padding: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.nav-wrapper {
  display: flex;
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
  padding: 0.75rem 0.75rem;
  margin: 0 .125rem;
  font-size: 14px;
  font-weight: 700;
  color: rgba(#000, 0.9);
  background-color: #eee;
  border: 0;
  border-radius: 12px;

  &:focus {
    outline: 0;
  }

  &.active {
    color: #fff;
    background-color: #42b983;
  }
}
</style>
