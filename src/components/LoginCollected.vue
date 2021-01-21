<template>
  <Card title="コンプ率">
    <div v-if="!isLoadComplete">
      計算中...
    </div>
    <div v-if="isLoadComplete">
      <div style="margin-bottom: 1rem;">
        <LoginCollectedBar
          text="全体"
          :value="allCollectedLength"
          :totalValue="allTotalLength"
          :isAll="true"
        />
      </div>
      <div v-for="nav in navs" :key="nav.id">
        <template v-if="nav.subnavs">
          <LoginCollectedBar
            v-for="subnav in nav.subnavs"
            :key="subnav.id"
            :text="subnav.text"
            :value="collectedLengths[subnav.id]"
            :totalValue="totalLengths[subnav.id]"
          />
        </template>
        <template v-else>
          <LoginCollectedBar
            :key="nav.id"
            :text="nav.text"
            :value="collectedLengths[nav.id]"
            :totalValue="totalLengths[nav.id]"
          />
        </template>
      </div>
    </div>
    <p class="note">
      一部のカテゴリに「素材」や「消費アイテム」、「植物」が例外的に含まれていますが、これらのコンプ状況は「全体」のコンプ率の計算対象には含まれていません。
    </p>
  </Card>
</template>

<script>
import {
  navs,
  totalLength,
  collectedLength,
  allTotalLength,
  allCollectedLength
} from "../utils/nav";
import Card from "./Card";
import LoginCollectedBar from "./LoginCollectedBar";

export default {
  data() {
    return {
      isLoadComplete: null,
      totalLengths: null,
      collectedLengths: null,
      allTotalLength: null,
      allCollectedLength: null,
      navs: navs
    };
  },
  components: {
    Card,
    LoginCollectedBar
  },
  computed: {
    collected() {
      return this.$store.getters.localCollectedData;
    }
  },
  created() {
    setTimeout(() => {
      this.totalLengths = this.getLengths();
      this.collectedLengths = this.getLengths(true);
      this.allTotalLength = allTotalLength();
      this.allCollectedLength = allCollectedLength(this.collected);
      this.isLoadComplete = true;
    }, 0);
  },
  methods: {
    getLengths(isCollected) {
      const result = {};
      navs.forEach(nav => {
        const subnavs = nav.subnavs;
        const collected = this.collected;
        const typeFilter = "0";
        if (subnavs) {
          subnavs.forEach(subnav => {
            result[subnav.id] = isCollected
              ? collectedLength({ nav: subnav.id, collected, typeFilter })
              : totalLength({ nav: subnav.id, typeFilter });
          });
        } else {
          result[nav.id] = isCollected
            ? collectedLength({ nav: nav.id, collected, typeFilter })
            : totalLength({ nav: nav.id, typeFilter });
        }
      });
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.note {
  font-size: 12px;
  margin: 1rem 0 0;
}
</style>
