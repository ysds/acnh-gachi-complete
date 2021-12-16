<template>
  <div class="searchbox">
    <div class="search">
      <SearchInput
        :searchText="searchText"
        :isSearchMode="isSearchMode"
        :placeholder="'すべてのアイテム名から検索'"
        @input="onInputSearchText"
      />
      <Button @click="onClickCloseButton">完了</Button>
    </div>
    <SearchAdvanced @change="onChangeAdFilter" :isSearchMode="isSearchMode" />
  </div>
</template>

<script>
import SearchInput from "../components/SearchInput.vue";
import Button from "../components/Button";
import SearchAdvanced from "../components/SearchAdvanced.vue";

export default {
  name: "SearchBox",
  components: {
    SearchInput,
    Button,
    SearchAdvanced,
  },
  props: {
    isSearchMode: Boolean,
    searchText: {
      type: String,
      default: "",
    },
    change: Function,
    input: Function,
  },
  methods: {
    onInputSearchText: function (text) {
      this.$emit("input", text);
    },
    onClickCloseButton: function () {
      this.$emit("close");
    },
    onChangeAdFilter(filters) {
      this.$emit("changeAdFilter", filters);
    },
  },
};
</script>

<style scoped lang="scss">
.searchbox {
  position: relative;
  z-index: 1010;
  background-color: var(--app-body-bg);
}

.search {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 6px;
}
</style>
