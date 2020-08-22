<template>
  <div class="search">
    <div class="search-input-wrap">
      <form
        class="search-form"
        autocomplete="off"
        v-show="isSearchMode"
        @submit.prevent
      >
        <input
          type="text"
          class="search-input"
          :value="searchText"
          @input="onSearchInput"
          placeholder="すべてのアイテムから検索"
          ref="input"
          v-if="isShowInput"
        />
      </form>
      <Button
        class="search-clear"
        @click="onClickClearButton"
        v-show="searchText !== ''"
      >
        <span class="clear">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 50 50"
          >
            <path
              fill="#fff"
              stroke="#fff"
              stroke-width="4px"
              d="M9.016
          40.837a1.001 1.001 0 001.415-.001l14.292-14.309 14.292 14.309a1 1 0
          001.416-1.413L26.153 25.129 40.43 10.836a1 1 0 10-1.415-1.413L24.722
          23.732 10.43 9.423a1 1 0 10-1.415 1.413l14.276 14.293L9.015 39.423a1 1
          0 00.001 1.414z"
            />
          </svg>
        </span>
      </Button>
    </div>
    <Button @click="onClickCloseButton">完了</Button>
  </div>
</template>

<script>
import Button from "../components/Button";

export default {
  name: "SearchBox",
  components: {
    Button
  },
  props: {
    isSearchMode: Boolean,
    searchText: {
      type: String,
      default: ""
    },
    change: Function,
    input: Function
  },
  data() {
    return {
      isShowInput: true
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
    onClickClearButton: function() {
      this.$emit("input", "");
      this.isShowInput = false;
      this.$nextTick(function() {
        this.isShowInput = true;
        this.$nextTick(function() {
          this.$refs.input.focus();
        });
      });
    },
    onClickCloseButton: function() {
      this.$emit("close");
    },
    onSearchInput: function(event) {
      if (this.searchText !== event.target.value) {
        this.$emit("input", event.target.value);
      }
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

.search-input-wrap {
  display: flex;
  align-items: center;
  margin-right: 0.25rem;
  width: 100%;
  height: 40px;
  border-bottom: 3px solid #007bff;
}

.search-input {
  width: 100%;
  margin-top: 2px;
  appearance: none;
  padding-right: 0;
  padding-left: 0;
  background-color: transparent;
  border: 0;
  border-radius: 0;
  outline: none;
  font-size: 15px;
  font-weight: 700;

  @media (min-width: 321px) {
    font-size: 18px;
  }
}

.search-clear {
  margin-left: 0.5rem;
  height: 32px;
  min-width: 32px;
  line-height: 32px;
}

.clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background-color: #ccc;
  border-radius: 50%;
}
</style>
