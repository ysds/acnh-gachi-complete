<template>
  <div class="home">
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
    <ul class="items" v-if="showItems.length > 0">
      <Item
        v-for="item in showItems"
        :item="item"
        :collected="collected[item.uniqueEntryId] || collected[item.name]"
        :key="item.name + item.sourceSheet"
        @change="onChangeItemCheck"
      />
    </ul>
    <div class="noitems" v-else-if="!isSearchMode">
      表示するアイテムがありません。
    </div>
  </div>
</template>

<script>
import items from "../assets/items.json";
import { filterItems, links } from "../utils/utils.js";

import Nav from "../components/Nav.vue";
import SearchBox from "../components/SearchBox.vue";
import FilterUI from "../components/FilterUI.vue";
import Item from "../components/Item.vue";

export default {
  name: "Collection",
  components: {
    Nav,
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
        collected: null
      },
      isSearchMode: false,
      searchText: "",
      links: links,
      showItems: []
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
    this.collected = collected;
    this.nav = nav;
    this.filter = filter;
    this.updateList();
  },
  computed: {
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
    updateList: function() {
      const self = this;
      self.showItems = [];
      const list = filterItems(
        items,
        this.collected,
        this.nav,
        this.filter,
        this.isSearchMode,
        this.searchText,
        this.isShowSaleFilter
      );
      const ite = (function*() {
        while (true) {
          const items = list.splice(0, 100);
          if (items.length <= 0) break;
          yield setTimeout(() => {
            for (let len = items.length, i = 0; i < len; i++) {
              const item = items[i];
              self.showItems.push(item);
            }
            ite.next();
          });
        }
      })();
      ite.next();
    },
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
      this.updateList();
    },
    onChangeFilter: function(activeFilter) {
      this.filter = activeFilter;
      this.$vlf.setItem("filter", this.filter);
      this.updateList();
    },
    onClickSearchBtn: function(isSearchMode) {
      this.isSearchMode = isSearchMode;
    },
    onInputSearchBox: function(text) {
      this.searchText = text;
      this.updateList();
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
}

.noitems {
  margin-top: 3rem;
  text-align: center;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.6);
}

.search-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  width: calc(100vw - 1rem);
  pointer-events: none;
}
</style>
