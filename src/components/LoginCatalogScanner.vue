<template>
  <Card title="動画を撮影してインポート">
    <p>
      「<a target="_blank" rel="noopener" href="https://nook.lol/"
        >カタログスキャナー</a
      >」を経由して、ゲーム画面を撮影した動画や画像から取得状態をインポートすることができます。「カタログ」「レシピ」「いきもの図鑑」「リアクション」「曲」に対応しています。
    </p>
    <div style="text-align: center" class="mb-6">
      <Button sm dropdown @click="isOpenDesc = !isOpenDesc"
        >詳しい使い方を見る</Button
      >
    </div>
    <div class="desc" v-show="isOpenDesc">
      <h5>1️⃣ ゲーム画面を撮影する</h5>
      <h6>カタログをインポートする場合</h6>
      <ol>
        <li style="color: #f33">
          カタログをインポートする場合、Nintendo Switch
          の本体言語を英語にすることをお勧めします。日本語のまま撮影すると動画の解析に失敗することが多いようです。
        </li>
        <li>ゲームのカタログ画面を表示します。</li>
        <li>
          コントローラーの「右」のアナログスティックを下に押したままにして、一番下までスクロールします。
        </li>
        <li>
          スクロールし終わったら、コントローラーのキャプチャボタンを押して30秒の動画を記録します。
          <blockquote class="twitter-tweet" data-media-max-width="560">
            &mdash; Ehsan&#39;s Switch Pics (@ehsanswitchpics)
            <a
              href="https://twitter.com/ehsanswitchpics/status/1260811239145406464?ref_src=twsrc%5Etfw"
              >May 14, 2020</a
            >
          </blockquote>
        </li>
        <li>
          注意: カタログが長く、30
          秒で一番下までスクロールできない場合は、カタログ画面のサブカテゴリを撮影してください。
        </li>
      </ol>
      <h6>レシピをインポートする場合</h6>
      <ol>
        <li>DIYレシピ画面を表示します。</li>
        <li>
          コントローラーの「左」のアナログスティックを下に押したままにして、一番下までスクロールします。
        </li>
        <li>
          スクロールし終わったら、コントローラーのキャプチャボタンを押して30秒の動画を記録します。
          <blockquote class="twitter-tweet" data-media-max-width="560">
            &mdash; Ehsan&#39;s Switch Pics (@ehsanswitchpics)
            <a
              href="https://twitter.com/ehsanswitchpics/status/1269833814450171906?ref_src=twsrc%5Etfw"
              >June 8, 2020</a
            >
          </blockquote>
        </li>
      </ol>
      <h6>いきもの図鑑をインポートする場合</h6>
      <ol>
        <li>
          いきもの図鑑画面を表示します。このとき「図鑑表示」ではなく「リスト表示」になっていることを確認してください。
        </li>
        <li>右に移動しながらすべての生き物を表示します。</li>
        <li>
          すべて表示し終わったら、コントローラーのキャプチャボタンを押して30秒の動画を記録します。
          <blockquote class="twitter-tweet" data-media-max-width="560">
            &mdash; Ehsan&#39;s Switch Pics (@ehsanswitchpics)
            <a
              href="https://twitter.com/ehsanswitchpics/status/1294543987601108992?ref_src=twsrc%5Etfw"
              >August 15, 2020</a
            >
          </blockquote>
        </li>
      </ol>
      <h6>リアクションをインポートする場合</h6>
      <ol>
        <li>すべてのリアクション画面を表示します。</li>
        <li>カーソルを空いている場所または右下端に移動します。</li>
        <li>
          コントローラーのキャプチャボタンを押してスクリーンショットを撮影します。
        </li>
      </ol>
      <h6>曲をインポートする場合</h6>
      <ol>
        <li>音楽プレイヤーを操作して曲一覧を表示します。</li>
        <li>
          コントローラーの「左」のアナログスティックを下に押したままにして、一番下までスクロールします。
        </li>
        <li>
          スクロールし終わったら、コントローラーのキャプチャボタンを押して30秒の動画を記録します。
          <blockquote class="twitter-tweet" data-media-max-width="560">
            &mdash; Ehsan&#39;s Switch Pics (@ehsanswitchpics)
            <a
              href="https://twitter.com/ehsanswitchpics/status/1300224186317635584?ref_src=twsrc%5Etfw"
              >August 31, 2020</a
            >
          </blockquote>
        </li>
      </ol>

      <h5>2️⃣ 撮影したものを編集して Twitter に投稿する</h5>
      <ol>
        <li>
          Switch
          のアルバムで記録した動画を選び、スクロールの開始から終了部分だけを切り出します。リアクションの場合は動画ではないのでこの作業は不要です。※Animal
          Crossing Worldの画像をお借りしています。
          <img
            src="../assets/E7hVeskVcAkgvaf.jpg"
            style="width: 100%; margin-bottom: 1rem"
          />
        </li>
        <li>
          Switch のアルバムから Twitter に投稿します。投稿文は空でも OK
          ですが、タイムラインに流さないいわゆるトスツイなどをお勧めします。
          ※Animal Crossing Worldの画像をお借りしています。
          <img
            src="../assets/E7hVfArVUAI0idJ.jpg"
            style="width: 100%; margin-bottom: 1rem"
          />
        </li>
        <li>
          投稿したツイートの共有ボタンからツイートの「リンクをコピー」を選択して、クリップボードにコピーします。
        </li>
      </ol>

      <h5>3️⃣ カタログスキャナー bot を使用する</h5>
      <ol>
        <li>
          <a href="http://discord.gg/acnhhub" target="_blank" rel="noopener"
            >ACNH Hub Discord サーバー</a
          >に参加します。
        </li>
        <li>
          任意のチャンネルで /scan コマンドを使用して、ツイートの URL
          を貼り付けてカタログスキャナー bot
          を実行します。このとき投稿したメッセージは自分にだけしか表示されないので安心してください。
          例: /scan url:https://x.com/xxx/status/xxxxx
          <img
            src="../assets/bot1.jpeg"
            style="width: 100%; margin-bottom: 1rem"
          />
        </li>
        <li>
          しばらくすると bot から
          結果が返ってきます。正常に処理が終了した場合、https://nook.lol/...
          のような URL が返ってきます。
          <img
            src="../assets/bot2.jpeg"
            style="width: 100%; margin-bottom: 1rem"
          />
        </li>
        <li>
          受けとった URL
          をこの下にあるテキストボックスに貼り付けてインポートボタンを押します。
        </li>
      </ol>
    </div>

    <div class="mb-4">
      <h5>バリエーションがあるアイテムについて</h5>
      <p>
        カタログスキャナーから得られるデータからは取得済みのアイテム名のみのため、「家具」、「ファッション」、「柵」などの複数のバリエーションがあるアイテムはどのバリエーションを取得しているか判定できません。バリエーションがあるアイテムをどのようにインポートするか設定してください。
      </p>
      <ButtonRadio
        :active="isImportVariants === false"
        @click="onChangeImportVariants(false)"
        >バリエーションのあるアイテムのチェック状態をインポートしない</ButtonRadio
      >
      <ButtonRadio
        :active="isImportVariants"
        @click="onChangeImportVariants(true)"
        >カイゾーリメイクできるアイテムの場合、すべてのバリエーションを取得済としてインポートする
        <span style="font-weight: 400">
          （バリエーション違いの取得管理を気にしない方はこちらがお勧めです）
        </span></ButtonRadio
      >
    </div>
    <p style="font-weight: 700; margin-bottom: 0.5rem">
      以下のテキストボックスに、カタログスキャナーから発行された URL
      を貼り付けて、インポートボタンを押してください。<span
        style="font-weight: 400"
        >ガチコンプで既に取得済・配布可にチェックされているアイテムの状態はそのまま維持されますので、何度でもインポート可能です。</span
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
    <template v-if="failedNames.length > 0">
      <p class="message">
        以下のアイテムは、動画または画像のスキャン結果に誤りがあるか、データが存在しないためインポートできませんでした。
      </p>
      <ul class="message">
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
      isOpenDesc: false,
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
  mounted() {
    window.twttr = (() => {
      const fjs = this.$refs.tweet;
      let js;
      let t = window.twttr || {};
      if (t.widgets) return t; // もう関数定義されている
      js = document.createElement("script");
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.appendChild(js);

      t._e = [];
      t.ready = function (f) {
        t._e.push(f);
      };
      return t;
    })();

    window.twttr.ready(() => {
      window.twttr.widgets.load(this.$refs.tweet);
    });
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
              } else if (this.isImportVariants && item.cyrusCustomizePrice) {
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

          if (hasVariableItem > 0) {
            if (this.isImportVariants) {
              this.message += `カイゾーリメイクできないバリエーションがある ${hasVariableItem} 個のアイテムは、カタログスキャナーからのデータでは何色を持っているか不明なため除外しました。`;
            } else {
              this.message += `バリエーションがある ${hasVariableItem} 個のアイテムは、カタログスキャナーからのデータでは何色を持っているか不明なため除外しました。`;
            }
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

ol {
  padding-left: 1rem;
}
</style>
