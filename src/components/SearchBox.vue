<template>
  <div class="search">
    <form
      class="search-form"
      autocomplete="off"
      v-show="isSearchMode"
      @submit.prevent
    >
      <input
        type="text"
        class="search-input"
        :value="value"
        @input="onSearchInput"
        placeholder="すべてのアイテムから検索"
        ref="input"
      />
    </form>
    <CloseButton @click="onClickCloseButton" />
  </div>
</template>

<script>
import CloseButton from "../components/CloseButton";

export default {
  name: "SearchBox",
  components: {
    CloseButton
  },
  props: {
    isSearchMode: Boolean,
    searchText: String,
    change: Function,
    input: Function
  },
  data() {
    return {
      value: this.searchText || ""
    };
  },
  watch: {
    isSearchMode: function(isSearchMode) {
      if (isSearchMode) {
        this.$nextTick(function() {
          this.$refs.input.focus();
          this.$emit("input", "");
        });
      }
    }
  },
  methods: {
    onClickCloseButton: function() {
      this.$emit("click");
    },
    onSearchInput: function(event) {
      this.$emit("input", event.target.value);
    }
  }
};
</script>

<style scoped lang="scss">
.search {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-form {
  flex-grow: 1;
  padding-left: 0.5rem;
  pointer-events: auto;
  background-color: #fff;
}

.search-input {
  width: 100%;
  appearance: none;
  padding-right: 0;
  padding-left: 0;
  border: 0;
  border-bottom: 3px solid #007bff;
  border-radius: 0;
  outline: none;
  font-size: 18px;
  font-weight: 700;
}
</style>
