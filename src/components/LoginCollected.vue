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
  </Card>
</template>

<script>
import { navs } from "../utils/navs";
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
      allTotalLength: undefined,
      allCollectedLength: undefined,
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
    isFullMode() {
      return this.$store.getters.settings.isFullMode;
    },
    partnerlist() {
      return this.$store.getters.partnerlist;
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
      this.totalLengths = this.initLengths();
      this.collectedLengths = Object.assign({}, this.totalLengths);

      const workerResult = {
        collectedLengths: [],
        complete: false,
      };

      // CollectedLength更新完了までの目安時間（ミリ秒）
      const MSEC = 500;
      // LoginCollectedBarに渡すCollectedLengthの小数点以下精度
      const PREC = 1000;

      let start = 0;
      let frame = 0;
      let fps = 60;
      let currentCollectedLengths = {};
      const updateCollected = () => {
        let update = !workerResult.complete;
        if (workerResult.allCollectedLength >= 0) {
          const newCollectedLength = Math.min(
            Math.ceil(
              (this.allCollectedLength +
                workerResult.allCollectedLength / fps / (MSEC / 1000)) *
                PREC
            ) / PREC,
            workerResult.allCollectedLength
          );
          if (newCollectedLength > this.allCollectedLength) {
            this.allCollectedLength = newCollectedLength;
            update = true;
          } else {
            delete workerResult["allCollectedLength"];
          }
        }
        Object.entries(workerResult.collectedLengths).forEach(
          ([id, length]) => {
            const newCollectedLength = Math.min(
              Math.ceil(
                (currentCollectedLengths[id] + length / fps / (MSEC / 1000)) *
                  PREC
              ) / PREC,
              length
            );
            if (newCollectedLength > currentCollectedLengths[id]) {
              if (
                (newCollectedLength - this.collectedLengths[id]) / length >=
                0.02
              ) {
                // 更新頻度を下げるため、2%以上の変動がある場合のみ更新
                this.collectedLengths[id] = newCollectedLength;
              }
              currentCollectedLengths[id] = newCollectedLength;
              update = true;
            } else {
              if (newCollectedLength > this.collectedLengths[id]) {
                this.collectedLengths[id] = newCollectedLength;
              }
              delete workerResult.collectedLengths[id];
            }
          }
        );
        if (update) {
          fps = 1000 / ((performance.now() - start) / ++frame);
          requestAnimationFrame(updateCollected);
        }
      };

      /* TotalLengthとCollectedLengthはUIスレッドの負荷を下げるために別スレッド（WebWorker）で計算する */
      this.$worker.onmessage = (e) => {
        const { data } = e;
        if (data.allTotalLength !== undefined) {
          this.isLoadComplete = true;
          this.allTotalLength = data.allTotalLength;
        } else if (data.allCollectedLength !== undefined) {
          this.allCollectedLength = 0;
          workerResult.allCollectedLength = data.allCollectedLength;
          start = performance.now();
          requestAnimationFrame(updateCollected);
        } else if (data.navsLengths) {
          Object.entries(data.navsLengths).forEach(([id, lengths]) => {
            this.totalLengths[id] = lengths[0];
            this.collectedLengths[id] = 0;
            currentCollectedLengths[id] = 0;
            workerResult.collectedLengths[id] = lengths[1];
          });
        } else if (data.complete) {
          workerResult.complete = true;
        }
      };
      this.$worker.postMessage({
        collected: this.collected,
        isFullMode: this.isFullMode,
        partnerlist: this.partnerlist,
      });
    },
    initLengths() {
      const result = {};
      this.navs.forEach((nav) => {
        const subnavs = nav.subnavs;
        if (subnavs) {
          subnavs.forEach((subnav) => {
            result[subnav.id] = undefined;
          });
        } else {
          result[nav.id] = undefined;
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
