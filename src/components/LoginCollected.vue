<template>
  <Card title="コンプ率">
    <div v-if="!isLoadComplete" style="text-align: center; margin-bottom: 2rem">
      <Button block @click="startGetLength">
        <span v-show="!isGetting">コンプ率を表示</span>
        <span v-show="isGetting">計算中...</span>
      </Button>
    </div>
    <div v-if="isLoadComplete">
      <div style="margin-bottom: 1rem">
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
  allCollectedLength,
} from "../utils/nav";
import Card from "./Card";
import LoginCollectedBar from "./LoginCollectedBar";
import Button from "./Button";

export default {
  data() {
    return {
      isGetting: false,
      isLoadComplete: null,
      totalLengths: null,
      collectedLengths: null,
      allTotalLength: null,
      allCollectedLength: null,
    };
  },
  components: {
    Card,
    LoginCollectedBar,
    Button,
  },
  computed: {
    collected() {
      return this.$store.getters.localCollectedData;
    },
    navs() {
      return navs.filter((nav) => {
        return nav.id !== "exchange" && nav.id.indexOf("separator");
      });
    },
  },
  methods: {
    startGetLength() {
      this.isGetting = true;
      setTimeout(() => {
        this.totalLengths = this.getLengths();
        this.collectedLengths = this.getLengths(true);
        this.allTotalLength = allTotalLength();
        this.allCollectedLength = allCollectedLength(this.collected);
        this.isLoadComplete = true;
        this.isGetting = false;
      }, 0);
    },
    getLengths(isCollected) {
      const result = {};
      navs.forEach((nav) => {
        const subnavs = nav.subnavs;
        const collected = this.collected;
        if (subnavs) {
          subnavs.forEach((subnav) => {
            result[subnav.id] = isCollected
              ? collectedLength({ nav: subnav.id, collected })
              : totalLength({ nav: subnav.id });
          });
        } else {
          result[nav.id] = isCollected
            ? collectedLength({ nav: nav.id, collected })
            : totalLength({ nav: nav.id });
        }
      });
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.note {
  font-size: 12px;
  margin: 1rem 0 0;
}
</style>
