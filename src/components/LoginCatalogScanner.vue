<template>
  <Card title="動画を撮影してインポート">
    <p>
      撮影した動画や画像から取得状態をスキャンすることができる 「<a
        target="_blank"
        rel="noopener"
        href="https://nook.lol/"
        >カタログスキャナー</a
      >」からデータをインポートすることができます。「カタログ」「レシピ」「いきもの図鑑」「リアクション」「曲」に対応しています。
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
    <div class="mb-4">
      <h5>バリエーションがあるアイテムについて</h5>
      <p>
        あつ森の仕様上、カタログ画面を撮影した動画ではアイテムのバリエーションが判別できないため、バリエーションの取得情報を正確にインポートできません。バリエーションがあるアイテムをどのようにインポートするか設定してください。
      </p>
      <ButtonRadio
        :active="isImportVariants === false"
        @click="onChangeImportVariants(false)"
        >バリエーションのあるアイテムのチェック状態をインポートしない</ButtonRadio
      >
      <ButtonRadio
        :active="isImportVariants"
        @click="onChangeImportVariants(true)"
        >カイゾーリメイクできる場合、全バリエーションを取得済でインポートする（既に配布可でチェックされているバリエーションはそのまま）</ButtonRadio
      >
    </div>
    <p style="font-weight: 700; margin-bottom: 0.5rem">
      以下のテキストボックスに、発行された URL
      を貼り付けて、インポートボタンを押してください。<span
        style="font-weight: 400"
        >あつ森ガチコンプで既にチェックされているアイテムの状態はそのまま維持されますので、何度でもインポート可能です。カタログを撮影した動画の解析がうまくいかない場合、Switchの本体言語を英語にすると成功率が上がる可能性があります。</span
      >
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
    <div style="text-align: center">
      <Button cta @click="onClickImport">インポート</Button>
    </div>
  </Card>
</template>

<script>
import Card from "./Card";
import Button from "./Button";
import Input from "./Input";
import ButtonRadio from "./ButtonRadio";

import itemsJson from "../assets/items.json";
import { zen_han_conv } from "../utils/utils";

import firebase from "../plugins/firebase";

const functions = firebase.functions();

export default {
  components: {
    Card,
    Button,
    Input,
    ButtonRadio,
  },
  data() {
    return {
      inputValue: "",
      message: "",
      failedNames: [],
      isImportVariants: null,
    };
  },
  computed: {
    collected() {
      return this.$store.getters.localCollectedData;
    },
  },
  async created() {
    this.isImportVariants =
      (await this.$vlf.getItem("isImportVariants")) || false;
  },
  methods: {
    onInput() {},
    onChangeImportVariants(state) {
      this.isImportVariants = state;
      this.$vlf.setItem("isImportVariants", state);
    },
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
        .then((res) => {
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
          let hasVariableItem = 0;

          for (const name of names) {
            const catalogName = zen_han_conv(name);
            const item = itemsJson.find((item) => {
              const isMatchName =
                zen_han_conv(item.displayName) === catalogName ||
                item.name === name;
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
              } else if (this.isImportVariants) {
                const currentCollected = collected[itemkey] || "";
                let newCollected = "0123456789".substring(0, itemLength);
                const providableCollected = currentCollected.replace(
                  /[0123456789]/g,
                  ""
                );
                [...providableCollected].forEach((char) => {
                  const hasChar = char.charCodeAt() - 65;
                  newCollected.replace(hasChar, "");
                  newCollected += providableCollected;
                });
                updateItemsData[itemkey] = newCollected;
              } else {
                hasVariableItem++;
              }
            } else {
              failedNames.push(name);
            }
          }

          this.message = `全 ${names.length} 個のデータから ${
            Object.keys(updateItemsData).length
          } 個のチェックデータをインポートしました。`;

          if (hasVariableItem.length > 0) {
            this.message += `バリエーションがある ${hasVariableItem} 個のアイテムは除外しました。`;
          }

          this.failedNames = failedNames;

          this.$store.commit("updateLocalCollectedDataBatch", {
            items: Object.keys(updateItemsData),
            collectedArray: Object.values(updateItemsData),
          });
        })
        .catch((error) => {
          // Getting the Error details.
          this.massge = error.code;
          this.massge += error.message;
          this.massge += error.details;
          // ...
        });
    },
  },
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
