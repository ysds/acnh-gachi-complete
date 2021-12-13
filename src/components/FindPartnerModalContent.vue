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
    updateShowItems() {
      this.isLoadComplete = false;
      this.isEnableButton = false;
      this.candidateItem = null;
      this.resultItems = filterPartnerCandidates(
        this.modalItem,
        this.partnerlist
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
  },
};
</script>

<style lang="scss" scoped>
.info-image {
  margin: -1rem auto 0;
  display: table;
}

.info-image div {
  display: table-cell;
  width: 96px;
  height: 96px;
  text-align: center;
  font-size: 32px;
  border-radius: 0.25em;
}

.info-image-no-candidates {
  background-color: #eee;
}

.info-image-have-candidate {
  background-color: #42b983;
}

.info-image img {
  width: 100%;
  height: 100%;
}

.candidates {
  height: 300px;
  overflow-y: scroll;
  margin-top: 1rem;
}

.items {
  margin: 0;
  padding: 0;
}
</style>
