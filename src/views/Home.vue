<template>
  <div class="home">
    <Nav :active="activeFilter.base" @change="onChangeNav" />
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
import Item from "../components/Item.vue";
import Nav from "../components/Nav.vue";

export default {
  name: "Home",
  components: {
    Item,
    Nav,
  },
  data() {
    return {
      items: items,
      collected: {},
      activeFilter: {
        base: null,
      },
    };
  },
  mounted() {
    // Init localStrage
    const self = this;
    this.$vlf.getItem("collected").then(function(data) {
      if (data) self.collected = data;
    });
    this.$vlf.getItem("activeFilter").then(function(data) {
      if (data) self.activeFilter = data;
    });
  },
  computed: {
    showItems: function() {
      return items.filter((item) => {
        // 商店家具
        if (this.activeFilter.base === "housewares") {
          return (
            item.sourceSheet === "Housewares" && item.catalog == "For sale"
          );
        }
        // 商店小物
        if (this.activeFilter.base === "miscellaneous") {
          return (
            item.sourceSheet === "Miscellaneous" && item.catalog == "For sale"
          );
        }
        // 商店壁掛け
        if (this.activeFilter.base === "wallmounted") {
          return (
            item.sourceSheet === "Wall-mounted" && item.catalog == "For sale"
          );
        }
        // 魚模型
        else if (this.activeFilter.base === "bugmodel") {
          return item.variants && item.variants[0].source.includes("C.J.");
        }
        // 虫模型
        else if (this.activeFilter.base === "fishmodel") {
          return item.variants && item.variants[0].source.includes("Flick");
        }
        // ウェディング
        else if (this.activeFilter.base === "wedding") {
          return (
            item.sourceNotes === "Only available during Wedding Season" &&
            !item.diy
          );
        }
        // ラコスケ
        else if (this.activeFilter.base === "pascal") {
          return (
            (item.series === "mermaid" && !item.variants) ||
            (!item.diy &&
              item.variants &&
              item.variants[0].source.includes("Pascal")) ||
            (item.source && item.source.includes("Pascal"))
          );
        }
        // ローラン
        else if (this.activeFilter.base === "saharah") {
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
      this.activeFilter.base = activeNav;
      this.$vlf.setItem("activeFilter", this.activeFilter);
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
</style>
