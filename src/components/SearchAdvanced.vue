<template>
  <div class="advanced-search">
    <ToolbarFilterCollected
      :activeCollectedFilter="activeCollected"
      @change="onChangeCollected"
    />
    <Popper ref="categoryFilter">
      <template slot="reference">
        <Button dropdown sm @click="scrollIntoView">
          <template v-if="activeCategory">
            <inline-svg
              class="icon"
              :src="require(`../assets/nav/${activeCategory.parentsId}.svg`)"
            />
            <span v-html="activeCategory.text"></span>
          </template>
          <template v-else>種類</template>
        </Button>
      </template>
      <DropdownMenu ref="categoryDropdown" fixFirst>
        <DropdownItem
          v-for="category in categoryItems"
          selectable
          :active="activeCategory && category.id === activeCategory.id"
          :key="category.id"
          @click="onChangeCategory(category, category.filter)"
        >
          <inline-svg
            class="icon"
            v-if="category.parentsId"
            :src="require(`../assets/nav/${category.parentsId}.svg`)"
          />
          <span v-html="category.text"></span>
        </DropdownItem>
      </DropdownMenu>
    </Popper>
    <Popper ref="versionFilter">
      <template slot="reference">
        <Button dropdown sm maxWidth @click="scrollIntoView">
          <template v-if="activeVersion">
            {{ activeVersion }}
          </template>
          <template v-else>バージョン</template>
        </Button>
      </template>
      <DropdownMenu fixFirst>
        <DropdownItem
          v-for="version in versionItems"
          selectable
          :active="activeVersion === version"
          :key="version"
          @click="onChangeVersion(version)"
        >
          <span>{{ version }}</span>
        </DropdownItem>
      </DropdownMenu>
    </Popper>
    <Popper ref="sourceFilter">
      <template slot="reference">
        <Button dropdown sm maxWidth @click="scrollIntoView">
          <template v-if="activeSource">
            {{ activeSource.text }}
          </template>
          <template v-else>入手方法</template>
        </Button>
      </template>
      <DropdownMenu fixFirst>
        <DropdownItem
          v-for="source in sourceItems"
          selectable
          :active="activeSource && source.id === activeSource.id"
          :key="source.id"
          @click="onChangeSource(source)"
        >
          <span v-html="source.text"></span>
        </DropdownItem>
      </DropdownMenu>
    </Popper>
    <Popper ref="seasonFilter">
      <template slot="reference">
        <Button dropdown sm maxWidth @click="scrollIntoView">
          <template v-if="activeSeason">
            {{ activeSeason.text }}
          </template>
          <template v-else>入手時期</template>
        </Button>
      </template>
      <DropdownMenu fixFirst>
        <DropdownItem
          v-for="season in seasonItems"
          selectable
          :active="activeSeason && season.id === activeSeason.id"
          :key="season.id"
          @click="onChangeSeason(season)"
        >
          <span v-html="season.text"></span>
        </DropdownItem>
      </DropdownMenu>
    </Popper>
    <Popper ref="seriesFilter">
      <template slot="reference">
        <Button dropdown sm maxWidth @click="scrollIntoView">
          <template v-if="activeSeries">
            {{ activeSeries.text }}
          </template>
          <template v-else>シリーズ</template>
        </Button>
      </template>
      <DropdownMenu fixFirst>
        <DropdownItem
          v-for="series in seriesItems"
          selectable
          :active="activeSeries && series.id === activeSeries.id"
          :key="series.id"
          @click="onChangeSeries(series)"
        >
          <span v-html="series.text"></span>
        </DropdownItem>
      </DropdownMenu>
    </Popper>
  </div>
</template>

<script>
import InlineSvg from "vue-inline-svg";

import { navsFlat } from "../utils/navs";
import { itemNameCompare } from "../../script/sort";
import sources from "../../data/translation-custom/source.json";
import seasons from "../../data/translation-custom/seasonEvent.json";
import series from "../../data/translation-custom/series.json";

import Button from "../components/Button";
import Popper from "../components/Popper";
import DropdownMenu from "../components/DropdownMenu";
import DropdownItem from "../components/DropdownItem";
import ToolbarFilterCollected from "../components/ToolbarFilterCollected";

export default {
  name: "SearchBox",
  components: {
    InlineSvg,
    Button,
    Popper,
    DropdownMenu,
    DropdownItem,
    ToolbarFilterCollected,
  },
  props: {
    isSearchMode: Boolean,
  },
  data() {
    return {
      activeCategory: null,
      activeSource: null,
      activeSeason: null,
      activeCollected: null,
      activeVersion: null,
      activeSeries: null,
      adFilters: {
        category: null,
        source: null,
        season: null,
        collected: null,
        version: null,
        series: null,
      },
      versionItems: [
        "クリア",
        "3.0.0",
        "2.0.4",
        "2.0.0",
        "1.11.0",
        "1.10.0",
        "1.9.0",
        "1.8.0",
        "1.7.0",
        "1.6.0",
        "1.5.0",
        "1.4.0",
        "1.3.0",
        "1.2.0",
        "1.1.0",
        "1.0.0",
      ],
    };
  },
  watch: {
    isSearchMode(state) {
      if (!state) {
        this.activeCategory = null;
        this.activeSource = null;
        this.activeSeason = null;
        this.activeCollected = null;
        this.activeVersion = null;
        this.activeSeries = null;
        this.adFilters = {
          category: null,
          source: null,
          season: null,
          collected: null,
          version: null,
          series: null,
        };
        this.$emit("change", this.adFilters);
      }
    },
  },
  computed: {
    categoryItems() {
      const dropdownItems = Object.values(navsFlat).filter(
        (nav) =>
          (!nav.id.match(/special|season|nookpoints|hhp|versions/) &&
            nav.filter !== undefined) ||
          nav.id === "hhp-request"
      );
      dropdownItems.forEach((category) => {
        category.parentsId = category.id.split("-")[0];
      });
      return [{ id: "null", text: "クリア" }, ...dropdownItems];
    },
    sourceItems() {
      const dropdownItems = [];
      Object.keys(sources).forEach((id) => {
        const text = sources[id];
        if (text !== "") {
          dropdownItems.push({
            id,
            text,
          });
        }
      });
      dropdownItems.sort((a, b) => {
        if (a.text < b.text) {
          return -1;
        }
        if (a.text > b.text) {
          return 1;
        }
        return 0;
      });

      // すべてを追加
      dropdownItems.unshift({ id: "null", text: "クリア" });

      return dropdownItems;
    },
    seasonItems() {
      // 配列生成
      let dropdownItems = [];
      Object.keys(seasons).forEach((id) => {
        const text = seasons[id].text;
        const order = seasons[id].order || seasons[id].text;
        if (text !== "") {
          dropdownItems.push({
            id,
            text,
            order,
          });
        }
      });

      // ソート
      dropdownItems.sort((a, b) => {
        if (a.order < b.order) {
          return -1;
        }
        if (a.order > b.order) {
          return 1;
        }
        return 0;
      });

      // 同名の id を統合
      dropdownItems.forEach((item, index) => {
        if (index < dropdownItems.length - 1) {
          const nextItem = dropdownItems[index + 1];
          if (item.text === dropdownItems[index + 1].text) {
            nextItem.id = `${item.id}ー${nextItem.id}`;
            item.remove = true;
          }
        }
      });

      // 重複の削除
      dropdownItems = dropdownItems.filter((item) => !item.remove);

      // すべてを追加
      dropdownItems.unshift({ id: "null", text: "クリア" });

      return dropdownItems;
    },
    seriesItems() {
      const dropdownItems = [];
      Object.keys(series).forEach((id) => {
        const text = series[id];
        if (text !== "") {
          dropdownItems.push({
            id,
            text,
          });
        }
      });
      dropdownItems.sort(itemNameCompare());

      // すべてを追加
      dropdownItems.unshift({ id: "null", text: "クリア" });

      return dropdownItems;
    },
  },
  methods: {
    onChangeCategory(category, filter) {
      this.$refs.categoryFilter.doClose();
      if (category.id !== "null") {
        this.activeCategory = category;
      } else {
        this.activeCategory = null;
      }
      this.adFilters.category = filter;
      this.$emit("change", this.adFilters);
    },
    onChangeSource(source) {
      this.$refs.sourceFilter.doClose();
      if (source.id !== "null") {
        this.activeSource = source;
        const filter = function (item) {
          return item.source && item.source.includes(source.id);
        };
        this.adFilters.source = filter;
      } else {
        this.activeSource = null;
        this.adFilters.source = null;
      }
      this.$emit("change", this.adFilters);
    },
    onChangeSeason(season) {
      this.$refs.seasonFilter.doClose();
      if (season.id !== "null") {
        this.activeSeason = season;
        const filter = function (item) {
          return season.id.split("ー").includes(item.seasonEvent);
        };
        this.adFilters.season = filter;
      } else {
        this.activeSeason = null;
        this.adFilters.season = null;
      }
      this.$emit("change", this.adFilters);
    },
    onChangeCollected(collected) {
      this.activeCollected = collected;
      this.adFilters.collected = collected;
      this.$emit("change", this.adFilters);
    },
    onChangeVersion(version) {
      this.$refs.versionFilter.doClose();
      if (version !== "null" && version !== "クリア") {
        this.activeVersion = version;
        const filter = function (item) {
          return item.versionAdded === version;
        };
        this.adFilters.version = filter;
      } else {
        this.activeVersion = null;
        this.adFilters.version = null;
      }
      this.$emit("change", this.adFilters);
    },
    onChangeSeries(series) {
      this.$refs.seriesFilter.doClose();
      if (series.id !== "null") {
        this.activeSeries = series;
        const filter = function (item) {
          return item.series === series.id;
        };
        this.adFilters.series = filter;
      } else {
        this.activeSeries = null;
        this.adFilters.series = null;
      }
      this.$emit("change", this.adFilters);
    },
    scrollIntoView() {
      setTimeout(() => {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        if (dropdowns.length > 0) {
          const dropdown = dropdowns[dropdowns.length - 1];
          const activeItem = dropdown.getElementsByClassName("active")[0];
          if (activeItem) {
            dropdown.scrollTop = activeItem.offsetTop - 166;
          }
        }
      }, 0);
    },
  },
};
</script>

<style scoped lang="scss">
.advanced-search {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 8px;
  margin-left: -2px;
  padding-bottom: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  line-height: 1;
  -webkit-overflow-scrolling: touch;
}

.icon {
  width: 16px;
  height: 16px;
  margin-top: -2px;
  margin-right: 4px;
}
</style>
