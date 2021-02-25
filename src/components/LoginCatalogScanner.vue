<template>
  <Card title="動画を撮影してインポート">
    <p>
      撮影した動画や画像から取得状態をスキャンすることができる 「<a
        target="_blank"
        rel="noopener"
        href="https://nook.lol/"
        >カタログスキャナー</a
      >」からデータをインポートすることができます。
    </p>
    <p>
      「カタログ」「レシピ」「いきもの図鑑」「リアクション」「曲」に対応しています。ただし、家具やファッションのバリエーションのあるアイテムは、動画から解析できないためインポートされません。
    </p>
    <p>
      <a
        target="_blank"
        rel="noopener"
        href="https://translate.google.co.jp/translate?hl=ja&sl=en&tl=ja&u=https://nook.lol/"
        >カタログスキャナーの詳しい使い方（カタログスキャナーのウェブサイトの
        Google 翻訳を開きます)
      </a>
    </p>
    <p style="font-weight: 700; margin-bottom: .5rem;">
      このテキストボックスに、発行された URL
      を貼り付けて、インポートボタンを押してください。あつ森ガチコンプに既にデータが存在する場合は上書きされません。
    </p>
    <Input
      placeholder="https://nook.lol/..."
      v-model="inputValue"
      @input="onInput"
      @focus="$event.target.select()"
      class="mb-4"
    />
    <p v-if="message" class="message">
      {{ message }}
    </p>
    <template v-if="failedNames.length > 0" class="message">
      <p>
        以下のアイテムは、動画または画像のスキャン結果に誤りがあるか、データが存在しないためインポートできませんでした。
      </p>
      <ul>
        <li v-for="name in failedNames" :key="name">{{ name }}</li>
      </ul>
    </template>
    <div style="text-align: center;">
      <Button cta @click="onClickImport">インポート</Button>
    </div>
  </Card>
</template>

<script>
import Card from "./Card";
import Button from "./Button";
import Input from "./Input";

import itemsJson from "../assets/items.json";
import { zen_han_conv } from "../utils/utils";

import firebase from "../plugins/firebase";

const functions = firebase.functions();

export default {
  components: {
    Card,
    Button,
    Input
  },
  data() {
    return {
      inputValue: "",
      message: "",
      failedNames: []
    };
  },
  computed: {
    collected() {
      return this.$store.getters.localCollectedData;
    }
  },
  methods: {
    onInput() {},
    onClickImport() {
      this.message = "";
      this.failedNames = [];
      const inputArray = this.inputValue.split("/");
      const hash = inputArray[3];

      if (
        inputArray[0] !== "https:" ||
        inputArray[2] !== "nook.lol" ||
        hash === ""
      ) {
        this.message =
          "入力された URL を解析できません。URL に問題があるか、対応していない形式です。";
        return;
      }
      this.message = "インポート中...";

      functions
        .httpsCallable("catalogScan")({ hash })
        .then(res => {
          if (res.data.data.error || res.data.status !== 200) {
            this.message =
              "インポートに失敗しました。URL に問題があるか、予期せぬエラーです。";
            return;
          }
          const names = res.data.data.data;
          const type = res.data.data.type;
          const isRecipe = type === "recipes";

          const collected = Object.assign({}, this.collected);
          const updateItemsData = {};
          const failedNames = [];

          for (const name of names) {
            const item = itemsJson.find(item => {
              const isMatchName =
                zen_han_conv(item.displayName) === name || item.name === name;
              if (isRecipe) {
                return isMatchName && item.sourceSheet === "Recipes";
              } else {
                return isMatchName && item.sourceSheet !== "Recipes";
              }
            });

            if (item) {
              const itemLength = item.variants ? item.variants.length : 1;
              const itemkey = item.uniqueEntryId || item.name;
              if (itemLength === 1) {
                const currentCollected = collected[itemkey] || "";
                let newCollected = currentCollected;
                if (currentCollected === "") {
                  newCollected = "0";
                }
                updateItemsData[itemkey] = newCollected;
              }
            } else {
              failedNames.push(name);
            }
          }

          this.message = `${
            Object.keys(updateItemsData).length
          } 個のチェックデータをインポートしました。`;

          this.failedNames = failedNames;

          this.$store.commit("updateLocalCollectedDataBatch", {
            items: Object.keys(updateItemsData),
            collectedArray: Object.values(updateItemsData)
          });
        })
        .catch(error => {
          // Getting the Error details.
          this.massge = error.code;
          this.massge += error.message;
          this.massge += error.details;
          // ...
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.message {
  font-size: 12px;
  font-weight: 700;
}

h3 {
  font-size: 14px;
}

p,
ul,
ol {
  font-size: 12px;
}
</style>
