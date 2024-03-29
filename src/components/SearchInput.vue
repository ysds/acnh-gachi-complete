<template>
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
        :placeholder="placeholder"
        ref="input"
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
            fill="var(--app-body-bg)"
            stroke="var(--app-body-bg)"
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
</template>

<script>
import Button from "../components/Button";

export default {
  name: "SearchInput",
  components: {
    Button,
  },
  props: {
    isSearchMode: Boolean,
    searchText: {
      type: String,
      default: "",
    },
    placeholder: String,
  },
  watch: {
    isSearchMode: function (isSearchMode) {
      if (isSearchMode) {
        this.$nextTick(function () {
          this.focusOnInput();
          this.$emit("input", "");
        });
      }
    },
  },
  methods: {
    onClickClearButton: function () {
      // Use fakeinput for workaround iOS issue
      // https://bugs.webkit.org/show_bug.cgi?id=215736
      const fakeInput = document.createElement("input");
      fakeInput.setAttribute("type", "text");
      fakeInput.style.position = "absolute";
      fakeInput.style.opacity = 0;
      fakeInput.style.height = 0;
      fakeInput.style.fontSize = "16px";
      document.body.prepend(fakeInput);
      fakeInput.focus();

      setTimeout(() => {
        this.focusOnInput();
        this.$emit("input", "");
        fakeInput.remove();
      }, 100);
    },
    onSearchInput: function (event) {
      if (this.searchText !== event.target.value) {
        this.$emit("input", event.target.value);
      }
    },
    focusOnInput() {
      this.$refs.input.focus();
    },
  },
};
</script>

<style scoped lang="scss">
.search-form {
  flex-grow: 1;
  padding-left: 0.5rem;
  pointer-events: auto;
  background-color: var(--app-body-bg);
}

.search-input-wrap {
  display: flex;
  align-items: center;
  margin-right: 0.25rem;
  width: 100%;
  height: 40px;
  border-bottom: 3px solid var(--app-active);
}

.search-input {
  width: 100%;
  height: 34px;
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
  color: inherit;

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
