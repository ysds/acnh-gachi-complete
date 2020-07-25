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
    <FilterUI :filter="filter" @change="onChangeFilter" v-if="!isSearchMode" />
    <ul class="items" v-if="showItems.length > 0">
      <Item
        v-for="item in showItems"
        :item="item"
        :collected="collected[item.uniqueEntryId] || collected[item.name]"
        :key="item.name + item.sourceSheet"
        @change="toggleState"
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
      nav: null,
      filter: {
        sale: 0,
        collected: 0
      },
      isSearchMode: false,
      searchText: "",
      links: links
    };
  },
  mounted() {
    // Load data from localStrage
    const self = this;
    this.$vlf.getItem("collected").then(function(data) {
      if (data) self.collected = data;
    });
    this.$vlf.getItem("nav").then(function(data) {
      if (data) self.nav = data;
    });
    this.$vlf.getItem("filter").then(function(data) {
      if (data) self.filter = data;
    });
  },
  computed: {
    showItems: function() {
      return filterItems(
        items,
        this.collected,
        this.nav,
        this.filter,
        this.isSearchMode,
        this.searchText
      );
    }
  },
  methods: {
    toggleState: function(name, collected) {
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
    },
    onInputSearchBox: function(text) {
      this.searchText = text;
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
