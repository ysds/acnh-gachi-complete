<template>
  <div class="home">
    <div class="view-btn-wrapper">
      <ViewButton :filter="filter" @change="onChangeFilter" />
    </div>
    <div class="search-wrapper">
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
  </div>
</template>

<script>
import items from "../assets/items.json";
import { filterItems, links } from "../utils/utils.js";

import Nav from "../components/Nav.vue";
import ViewButton from "../components/ViewButton.vue";
import SearchBox from "../components/SearchBox.vue";
import FilterUI from "../components/FilterUI.vue";
import Item from "../components/Item.vue";

export default {
  name: "Collection",
  components: {
    Nav,
    ViewButton,
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
      isSearchResultOverThreshold: false
    };
  },
  async mounted() {
    // Load data from localStrage
    const self = this;
    const [collected, nav, filter] = await Promise.all([
      self.$vlf.getItem("collected"),
      self.$vlf.getItem("nav"),
      self.$vlf.getItem("filter")
    ]);
    this.collected = collected || {};
    this.nav = nav || "housewares";
    this.filter = Object.assign(
      {
        sale: "0",
        collected: "0",
        viewMode: "list"
      },
      filter
    );
  },
  computed: {
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
    },
    onChangeFilter: function(activeFilter) {
      this.filter = activeFilter;
      this.$vlf.setItem("filter", this.filter);
    },
    onClickSearchBtn: function(isSearchMode) {
      this.isSearchMode = isSearchMode;
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
  position: absolute;
  right: 76px;
  top: 4px;
}

.search-wrapper {
  position: absolute;
  right: 12px;
  top: 4px;
  left: 12px;
  pointer-events: none;
}
</style>
