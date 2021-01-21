<template>
  <Card title="インポート">
    <p class="small">
      「<a
        target="_blank"
        rel="noopener"
        href="https://modunogay.github.io/DIY/index.html"
        >DIYレシピチェッカー</a
      >」、「<a
        target="_blank"
        rel="noopener"
        href="https://modunogay.github.io/FTR/index.html"
        >家具チェッカー</a
      >」、「<a
        target="_blank"
        rel="noopener"
        href="https://modunogay.github.io/MISC/index.html"
        >小物家具チェッカー</a
      >」、「<a
        target="_blank"
        rel="noopener"
        href="https://modunogay.github.io/FTR_WALL/index.html"
        >壁掛け家具チェッカー</a
      >」から、データをインポートすることができます。
    </p>
    <p class="small" style="font-weight: 700; margin-bottom: .5rem;">
      このテキストボックスに、発行した URL
      を貼り付けて、インポートボタンを押してください。
    </p>
    <Input
      placeholder="https://modunogay.github.io/..."
      v-model="inputValue"
      @input="onInput"
      @focus="$event.target.select()"
      class="mb-4"
    />
    <p class="message-category" v-show="messageCategory">
      {{ messageCategory }}
    </p>
    <div class="small">{{ message }}</div>
    <div style="text-align: center;">
      <Button cta :disabled="!isEnableButton" @click="runImport">
        インポート
      </Button>
    </div>
    <Modal :show="isShowModal" @close="isShowModal = false">
      <template slot="header">
        データをインポートしました。
      </template>
      <template slot="body">
        <div class="batch-modal-body">
          <Button primary class="batch-btn" @click="isShowModal = false">
            OK
          </Button>
        </div>
      </template>
    </Modal>
  </Card>
</template>

<script>
import LZString from "lz-string";
import moduDiyMap from "../assets/modu-diy.json";
import moduHousewaresMap from "../assets/modu-housewares.json";
import moduMiscellaneousMap from "../assets/modu-miscellaneous.json";
import moduWallmountedMap from "../assets/modu-wallmounted.json";

import Button from "./Button";
import Card from "./Card";
import Input from "./Input";
import Modal from "./Modal";

export default {
  components: {
    Button,
    Card,
    Input,
    Modal
  },
  data() {
    return {
      inputValue: "",
      message: "",
      messageCategory: "",
      version: "",
      category: "",
      moduArray: [],
      isEnableButton: false,
      isShowModal: false
    };
  },
  computed: {
    collected() {
      return this.$store.getters.localCollectedData;
    }
  },
  methods: {
    onInput() {
      try {
        this.message = "";
        // Split URL
        const inputValue = this.inputValue;
        const http = inputValue.indexOf("https:") > -1 ? "https" : "http";
        const category = inputValue
          .match(/(\/DIY\/|\/FTR\/|\/MISC\/|\/FTR_WALL\/)/g)[0]
          .replace(/\//g, "");
        const query = inputValue.replace(
          `${http}://modunogay.github.io/${category}/index.html?`,
          ""
        );
        if (category === "DIY") {
          this.category = "レシピ";
        } else if (category === "FTR") {
          this.category = "家具";
        } else if (category === "MISC") {
          this.category = "小物";
        } else {
          this.category = "壁かけ";
        }

        // Decode
        let decodedQuery = query.split("_");
        decodedQuery = decodedQuery.join("+");
        decodedQuery = LZString.decompressFromEncodedURIComponent(decodedQuery);

        const splittedArray = decodedQuery.split("&");
        this.version = splittedArray[0];
        const moduCheckText = splittedArray[2];
        const moduArray = [];
        [].forEach.call(moduCheckText, function(str) {
          moduArray.push(str);
        });
        this.moduArray = moduArray;

        // Enable Button
        if (this.category === "レシピ" && moduArray.length === 607) {
          this.messageCategory = "レシピチェッカーのデータをインポートします。";
          this.ready();
        } else if (this.category === "家具" && moduArray.length === 1205) {
          this.messageCategory = "家具チェッカーのデータをインポートします。";
          this.ready();
        } else if (this.category === "小物" && moduArray.length === 654) {
          this.messageCategory =
            "小物家具チェッカーのデータをインポートします。";
          this.ready();
        } else if (this.category === "壁かけ" && moduArray.length === 256) {
          this.messageCategory =
            "壁掛け家具チェッカーのデータをインポートします。";
          this.ready();
        } else {
          this.error();
        }
      } catch (e) {
        this.error();
      }
    },
    runImport() {
      if (this.category === "レシピ") {
        let newCollectedArray = [];
        const collected = Object.assign({}, this.collected);
        const moduArray = this.moduArray;
        moduDiyMap.forEach((id, index) => {
          const currentCollected = collected[id] || "";
          const moduCollected = moduArray[index];
          let newCollected = currentCollected;
          if (currentCollected === "" && moduCollected !== "0") {
            newCollected = moduCollected === "1" ? "0" : "A";
          } else if (currentCollected === "0" && moduCollected === "2") {
            newCollected = "A";
          }
          newCollectedArray.push(newCollected);
        });
        this.$store.commit("updateLocalCollectedDataBatch", {
          items: moduDiyMap,
          collectedArray: newCollectedArray
        });
      } else if (this.category === "家具") {
        this.runFTRImport(moduHousewaresMap);
      } else if (this.category === "小物") {
        this.runFTRImport(moduMiscellaneousMap);
      } else if (this.category === "壁かけ") {
        this.runFTRImport(moduWallmountedMap);
      }
      this.isShowModal = true;
      this.inputValue = "";
      this.message = "";
      this.reset();
    },
    runFTRImport(moduMap) {
      let newCollectedArray = [];
      const collected = Object.assign({}, this.collected);
      const moduArray = this.moduArray;
      const newModuMap = [];
      let prevName = "";
      moduMap.forEach((key, index) => {
        const name = key.replace(/_.*/g, "");
        if (prevName !== name) newModuMap.push(name);
        let variantIndex = key.match(/_.*/g)[0];
        variantIndex = variantIndex.replace("_", "");

        console.log(collected[name]);

        const currentCollected = collected[name] || "";
        const moduCollected = moduArray[index];
        let newCollected = currentCollected;

        const moduNormalized = parseInt(variantIndex, 10);
        const moduNormalizedAlpha = String.fromCharCode(moduNormalized + 65);
        if (moduCollected === "1") {
          if (
            currentCollected.indexOf(moduNormalized) === -1 &&
            currentCollected.indexOf(moduNormalizedAlpha) === -1
          ) {
            newCollected = newCollected + moduNormalized;
          }
        } else if (moduCollected === "2") {
          newCollected = newCollected.replace(moduNormalized, "");
          newCollected = newCollected.replace(moduNormalizedAlpha, "");
          newCollected = newCollected + moduNormalizedAlpha;
        }

        newCollectedArray.push(newCollected);
        collected[name] = newCollected;
      });
      this.$store.commit("updateLocalCollectedDataBatch", {
        items: newModuMap,
        collectedArray: newCollectedArray
      });
    },
    ready() {
      this.message =
        "あつ森ガチコンプにもデータが存在する場合、チェック状態の高い方（配布可>取得済>未取得）が優先されて統合されます。";
      this.isEnableButton = true;
    },
    error() {
      if (this.inputValue) {
        this.message =
          "入力された URL を解析できません。URL に問題があるか、対応していない形式です。";
      }
      this.reset();
    },
    reset() {
      this.messageCategory = "";
      this.category = "";
      this.version = "";
      this.moduArray = [].slice();
      this.isEnableButton = false;
      this.messageCategory = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.message-category {
  color: #ec407a;
  font-size: 13px;
  font-weight: 700;
}

.batch-btn {
  float: right;
}
</style>
