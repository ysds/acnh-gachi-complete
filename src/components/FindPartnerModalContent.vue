<template>
  <div
    v-if="
      modalItem.sourceSheet === 'Paradise Planning' && !modalItem.houseShare
    "
  >
    <div class="info-image">
      <div>
        <img
          :src="'https://acnhcdn.com/latest/' + modalItem.variants[0].image"
        />
      </div>
      <div
        :class="{
          'info-image-no-candidates': !candidateImage,
          'info-image-have-candidate': candidateImage,
        }"
      >
        <img :src="candidateImage" v-if="candidateImage" />
        <span v-else>？</span>
      </div>
    </div>
    <Button
      cta
      :disabled="!isEnableButton"
      @click="$emit('addPartner', candidateItem)"
      >決定</Button
    >
    <div class="search">
      <div class="search-input-wrap">
        <form class="search-form" autocomplete="off" @submit.prevent>
          <input
            type="text"
            class="search-input"
            :value="searchText"
            @input="onSearchInput"
            placeholder="名前で検索"
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
    </div>
    <div class="candidates">
      <ul class="items">
        <PartnerCandidate
          v-for="item in showItems"
          :item="item"
          :isCandidate="candidateItem && item.name == candidateItem.name"
          :key="item.name + item.sourceSheet"
          @change="onChangeItemCheck"
        />
      </ul>
      <infinite-loading
        v-if="isLoadComplete !== null"
        :identifier="renderStartDate"
        :distance="2000"
        @infinite="loadMore"
      >
        <div slot="no-more"></div>
        <div slot="no-results" class="message">見つかりませんでした。</div>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import Button from "../components/Button";
import PartnerCandidate from "../components/PartnerCandidate";
import { filterPartnerCandidates } from "../utils/filterItems.js";

export default {
  components: { Button, PartnerCandidate },
  props: {
    modalItem: Object,
    partnerlist: Array,
  },
  data() {
    return {
      showItems: [],
      queueItems: [],
      renderStartDate: new Date().getTime(),
      isLoadComplete: null,
      isEnableButton: false,
      candidateItem: null,
      searchText: "",
    };
  },
  computed: {
    candidateImage() {
      return this.candidateItem
        ? "https://acnhcdn.com/latest/" + this.candidateItem.variants[0].image
        : "";
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
        this.$refs.input.focus();
        this.updateShowItems("");
        fakeInput.remove();
      }, 100);
    },
    updateShowItems(searchText) {
      this.searchText = searchText;
      this.isLoadComplete = false;
      this.isEnableButton = false;
      this.candidateItem = null;
      this.resultItems = filterPartnerCandidates(
        this.modalItem,
        this.partnerlist,
        this.searchText
      );
      this.showItems = [];
      this.renderStartDate = new Date().getTime();
      this.queueItems = this.resultItems.slice();
    },
    loadMore($state) {
      const loadLength = 100;
      const queueLength = this.queueItems.length;
      const count = queueLength >= loadLength ? loadLength : queueLength;
      for (let i = 0; i < count; i++) {
        this.showItems.push(this.queueItems[i]);
      }

      if (queueLength > 0) {
        $state.loaded();
      } else {
        $state.complete();
      }

      this.queueItems.splice(0, count);
      this.isLoadComplete = true;
    },
    onChangeItemCheck(item) {
      if (this.candidateItem && this.candidateItem.name == item.name) {
        this.candidateItem = null;
        this.isEnableButton = false;
      } else {
        this.candidateItem = item;
        this.isEnableButton = true;
      }
    },
    onSearchInput: function (event) {
      if (this.searchText !== event.target.value) {
        this.updateShowItems(event.target.value);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.info-image {
  margin: -1rem auto 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-image div {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  font-size: 32px;
  border-radius: 0.25em;
}

.info-image-no-candidates {
  background-color: var(--app-btn-gray2);
  color: var(--app-sub-text);
}

.info-image-have-candidate {
  background-color: #42b983;
}

.info-image img {
  width: 100%;
  height: 100%;
}

.search {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 6px;
}

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

.candidates {
  height: 300px;
  overflow-y: scroll;
  margin-top: 0;
  margin-right: -15px;
  margin-left: -15px;
  margin-bottom: -40px;

  @media (min-width: 321px) {
    margin-right: -24px;
    margin-left: -24px;
  }
}

.message {
  margin-top: 3rem;
  padding: 0 1rem;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  color: var(--app-sub-text);
}

.items {
  margin: 0;
  padding: 0;
}
</style>
