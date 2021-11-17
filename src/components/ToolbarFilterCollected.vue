<template>
  <Popper ref="collectedFilter">
    <template slot="reference">
      <Button dropdown sm :active="isOpenCollectedFilter()">
        <span v-html="collectedFilterLabel" />
      </Button>
    </template>
    <DropdownMenu>
      <DropdownItem
        v-for="collectedFilterItem in collectedFilterItems"
        selectable
        :active="
          activeCollectedFilter &&
          activeCollectedFilter === collectedFilterItem.id
        "
        :key="collectedFilterItem.id"
        @click="onClickCollectedFilter(collectedFilterItem.id)"
      >
        <span v-html="collectedFilterItem.label"></span>
      </DropdownItem>
    </DropdownMenu>
  </Popper>
</template>

<script>
import { collectedFilters } from "../utils/filter";

import Popper from "./Popper";
import Button from "./Button";
import DropdownMenu from "./DropdownMenu";
import DropdownItem from "./DropdownItem";

export default {
  components: {
    Popper,
    Button,
    DropdownMenu,
    DropdownItem,
  },
  props: {
    activeCollectedFilter: String,
  },

  computed: {
    collectedFilterItems() {
      if (this.isSearchMode) {
        let array = [...collectedFilters];
        array.shift();
        array.unshift({ id: null, label: "クリア", btnLabel: "状態" });
        return array;
      } else {
        return collectedFilters;
      }
    },
    collectedFilterLabel() {
      const matchedFilters = collectedFilters.filter(
        (obj) => obj.id === (this.activeCollectedFilter || "0")
      );
      if (matchedFilters.length === 1) {
        return matchedFilters[0].btnLabel || matchedFilters[0].label;
      } else {
        return "";
      }
    },
    isSearchMode() {
      return this.$store.getters.isSearchMode;
    },
  },
  methods: {
    isOpenCollectedFilter() {
      if (!this.$refs.collectedFilter) return false;
      return this.$refs.collectedFilter.isShowPopper();
    },
    onClickCollectedFilter(value) {
      if (this.$refs.collectedFilter) this.$refs.collectedFilter.doClose();
      this.$emit("change", value);
    },
  },
};
</script>
