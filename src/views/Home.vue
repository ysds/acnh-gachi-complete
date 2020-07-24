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
    <Nav :active="nav" @change="onChangeNav" v-if="!isSearchMode" />
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
  </div>
</template>

<script>
import items from "../assets/items.json";

import Nav from "../components/Nav.vue";
import SearchBox from "../components/SearchBox.vue";
import FilterUI from "../components/FilterUI.vue";
import Item from "../components/Item.vue";

const kataToHira = function(string) {
  return string.replace(/[\u30A1-\u30FA]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
};

export default {
  name: "Home",
  components: {
    Nav,
    SearchBox,
    FilterUI,
    Item,
  },
  data() {
    return {
      items: items,
      collected: {},
      nav: null,
      filter: {
        hiddenCollected: false,
      },
      isSearchMode: false,
      searchText: "",
    };
  },
  mounted() {
    // Init localStrage
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
      return items.filter((item) => {
        // 検索
        if (this.isSearchMode) {
          if (this.searchText === "") {
            return false;
          }
          const hiraDisplayName = kataToHira(item.displayName);
          return hiraDisplayName.indexOf(kataToHira(this.searchText)) !== -1;
        }
        // 所持済みを非表示
        if (this.filter.hiddenCollected) {
          if (
            (this.collected[item.uniqueEntryId] &&
              this.collected[item.uniqueEntryId].length > 0) ||
            (this.collected[item.name] &&
              item.variants &&
              item.variants.length === this.collected[item.name].length)
          ) {
            return false;
          }
        }

        // 商店家具
        if (this.nav === "housewares") {
          return (
            item.sourceSheet === "Housewares" && item.catalog == "For sale"
          );
        }
        // 商店小物
        else if (this.nav === "miscellaneous") {
          return (
            item.sourceSheet === "Miscellaneous" && item.catalog == "For sale"
          );
        }
        // 商店壁掛け
        else if (this.nav === "wallmounted") {
          return (
            item.sourceSheet === "Wall-mounted" && item.catalog == "For sale"
          );
        }
        // 魚模型
        else if (this.nav === "bugmodel") {
          return item.variants && item.variants[0].source.includes("C.J.");
        }
        // 虫模型
        else if (this.nav === "fishmodel") {
          return item.variants && item.variants[0].source.includes("Flick");
        }
        // ウェディング
        else if (this.nav === "wedding") {
          return (
            item.sourceNotes === "Only available during Wedding Season" &&
            !item.diy
          );
        }
        // ラコスケ
        else if (this.nav === "pascal") {
          return (
            (item.series === "mermaid" && !item.variants) ||
            (!item.diy &&
              item.variants &&
              item.variants[0].source.includes("Pascal")) ||
            (item.source && item.source.includes("Pascal"))
          );
        }
        // ローラン
        else if (this.nav === "saharah") {
          return item.variants && item.variants[0].source.includes("Saharah");
        }
      });
    },
  },
  methods: {
    toggleState: function(name, collected) {
      this.collected[name] = collected;
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
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  text-align: left;
}
.items {
  margin: 0;
  padding: 0;
}
.search-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  width: calc(100vw - 1rem);
}
</style>
