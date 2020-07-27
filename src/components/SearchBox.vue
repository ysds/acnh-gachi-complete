<template>
  <div class="search">
    <form class="search-form" autocomplete="off" v-show="isSearchMode">
      <input
        type="text"
        class="search-input"
        :value="value"
        @input="onSearchInput"
        placeholder="すべてのアイテムから検索"
        ref="input"
      />
    </form>
    <button type="button" class="search-btn" @click="onClickSearchButton">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0, 0, 24, 24"
        fill="none"
        stroke="#666"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        v-if="!isSearchMode"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4-4" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 50 50"
        v-else
      >
        <path
          fill="#231F20"
          d="M9.016 40.837a1.001 1.001 0 001.415-.001l14.292-14.309 14.292 14.309a1 1 0 001.416-1.413L26.153 25.129 40.43 10.836a1 1 0 10-1.415-1.413L24.722 23.732 10.43 9.423a1 1 0 10-1.415 1.413l14.276 14.293L9.015 39.423a1 1 0 00.001 1.414z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: "SearchBox",
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
  methods: {
    onClickSearchButton: function() {
      const isShowSearchBox = !this.isSearchMode;
      this.$emit("click", isShowSearchBox);
      if (isShowSearchBox) {
        this.$nextTick(function() {
          this.$refs.input.focus();
          this.$emit("input", "");
        });
      }
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

.search-btn {
  flex-shrink: 0;
  margin-left: auto;
  width: 64px;
  height: 64px;
  text-align: center;
  line-height: 64px;
  border: 0;
  background-color: #fff;
  pointer-events: auto;
}
</style>
