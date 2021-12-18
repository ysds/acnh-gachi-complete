<template>
  <div class="d-flex" :class="{ 'toolbar-share': isShareView }">
    <div class="d-flex">
      <Button
        sm
        @click="onClickVersion()"
        v-if="activeNav && !activeNav.includes('version')"
      >
        <template v-if="filter.version === 1">V1のみ</template>
        <template v-else-if="filter.version === 2">V2のみ</template>
        <template v-else>バージョン</template>
      </Button>
      <span v-show="typeFilterItems.length > 0">
        <Popper ref="typeFilter">
          <template slot="reference">
            <Button dropdown sm :active="isOpenTypeFilter()">
              <span v-html="typeFilterLabel" />
            </Button>
          </template>
          <DropdownMenu>
            <DropdownItem
              v-for="typeFilterItem in typeFilterItems"
              selectable
              :active="filter.typeFilter === typeFilterItem.id"
              :key="typeFilterItem.id"
              @click="onClickTypeFilter(typeFilterItem.id)"
            >
              <span v-html="typeFilterItem.label"></span>
            </DropdownItem>
          </DropdownMenu>
        </Popper>
      </span>
      <template v-if="isShowOrderChanger && isShareView">
        <Button
          sm
          v-if="filter.order === 'name'"
          @click="onClickOrderButton('id')"
        >
          名前順
        </Button>
        <Button
          sm
          v-else-if="filter.order === 'id'"
          @click="onClickOrderButton('name')"
        >
          {{ idOrderLabel }}
        </Button>
      </template>
    </div>
    <template v-if="activeNav === 'exchange'">
      <div>
        <Button
          sm
          style="
            margin-right: 0;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          "
          @click="onClickExchangeType('wishlist')"
          :active="filter.exchangeType === 'wishlist'"
          :primary="filter.exchangeType === 'wishlist'"
        >
          欲しいもの
        </Button>
        <Button
          sm
          style="
            margin-left: 0;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          "
          @click="onClickExchangeType('providable')"
          :active="filter.exchangeType === 'providable'"
          :primary="filter.exchangeType === 'providable'"
        >
          配布可
        </Button>
      </div>
      <div class="buttons" style="margin-top: 0.5rem" v-if="isShareView">
        <Button
          pill
          @click="
            onClickCollectedFilter(filter.collectedFilter === '0' ? '6' : '0')
          "
          :class="{ active: filter.collectedFilter === '6' }"
          v-if="filter.exchangeType === 'wishlist'"
          style="width: auto"
        >
          ゆずれるものだけ表示
        </Button>
        <Button
          pill
          @click="
            onClickCollectedFilter(filter.collectedFilter === '2' ? '5' : '2')
          "
          :class="{ active: filter.collectedFilter === '5' }"
          v-if="filter.exchangeType === 'providable'"
          style="width: auto"
        >
          もらえるものだけ表示
        </Button>
      </div>
    </template>
    <template v-else-if="!isShareView">
      <ToolbarFilterCollected
        :activeCollectedFilter="filter.collectedFilter"
        @change="onClickCollectedFilter"
      />
    </template>
    <template v-else>
      <div class="buttons">
        <Button
          v-for="collectedFilterItem in collectedFilterItems"
          v-html="collectedFilterItem.label"
          nav
          :key="collectedFilterItem.id"
          @click="onClickCollectedFilter(collectedFilterItem.id)"
          :class="{ active: filter.collectedFilter === collectedFilterItem.id }"
        />
      </div>
      <div class="buttons" style="margin-top: 0.5rem">
        <Button
          pill
          @click="onClickCollectedFilter('5')"
          :class="{ active: filter.collectedFilter === '5' }"
        >
          もらえる
        </Button>
        <Button
          pill
          @click="onClickCollectedFilter('6')"
          :class="{ active: filter.collectedFilter === '6' }"
        >
          ゆずれる
        </Button>
      </div>
    </template>
    <template v-if="isShowOrderChanger && !isShareView">
      <Button
        sm
        v-if="filter.order === 'name'"
        @click="onClickOrderButton('id')"
      >
        名前順
      </Button>
      <Button
        sm
        v-else-if="filter.order === 'id'"
        @click="onClickOrderButton('name')"
      >
        {{ idOrderLabel }}
      </Button>
    </template>
  </div>
</template>

<script>
import Popper from "./Popper";
import Button from "./Button";
import DropdownMenu from "./DropdownMenu";
import DropdownItem from "./DropdownItem";
import ToolbarFilterCollected from "./ToolbarFilterCollected";

import {
  typeFilters,
  collectedFilters,
  getTypeFilterItems,
} from "../utils/filter";

export default {
  components: {
    Popper,
    Button,
    DropdownMenu,
    DropdownItem,
    ToolbarFilterCollected,
  },
  props: {
    filter: Object,
    activeNav: String,
    isShareView: Boolean,
  },
  data() {
    return {
      collectedFilterItems: collectedFilters,
    };
  },
  computed: {
    typeFilterLabel() {
      const matchedFilters = typeFilters.filter(
        (obj) => obj.id === this.filter.typeFilter
      );
      if (matchedFilters.length === 1) {
        return matchedFilters[0].btnLabel || matchedFilters[0].label;
      } else {
        return "";
      }
    },
    typeFilterItems() {
      return getTypeFilterItems(this.activeNav);
    },
    isShowOrderChanger() {
      return (
        (this.activeNav && this.activeNav.indexOf("creatures") > -1) ||
        this.activeNav === "reactions" ||
        this.activeNav === "housewares-nookmiles" ||
        this.activeNav === "achievements" ||
        this.activeNav === "recipes" ||
        this.activeNav === "photos" ||
        this.activeNav === "posters"
      );
    },
    idOrderLabel() {
      if (this.activeNav === "photos" || this.activeNav === "posters") {
        return "種類順";
      } else {
        return "実機順";
      }
    },
  },
  methods: {
    onClickVersion() {
      const newValue =
        this.filter.version === false
          ? 1
          : this.filter.version === 1
          ? 2
          : false;
      this.$emit("change", Object.assign(this.filter, { version: newValue }));
    },
    onClickTypeFilter(value) {
      if (this.$refs.typeFilter) this.$refs.typeFilter.doClose();
      this.$emit("change", Object.assign(this.filter, { typeFilter: value }));
    },
    onClickCollectedFilter(value) {
      this.$emit(
        "change",
        Object.assign(this.filter, { collectedFilter: value })
      );
    },
    onClickOrderButton(value) {
      this.$emit("change", Object.assign(this.filter, { order: value }));
    },
    onClickExchangeType(value) {
      this.$emit("change", Object.assign(this.filter, { exchangeType: value }));
      if (value === "wishlist") {
        this.onClickCollectedFilter("0");
      } else {
        this.onClickCollectedFilter("2");
      }
    },
    isOpenTypeFilter() {
      if (!this.$refs.typeFilter) return false;
      return this.$refs.typeFilter.isShowPopper();
    },
  },
};
</script>

<style lang="scss" scoped>
.toolbar-share {
  flex-direction: column;
  align-items: center;
}

.buttons {
  display: flex;
  justify-content: center;

  > * {
    margin-right: 0.3rem;
    margin-left: 0.3rem;
  }
}
</style>
