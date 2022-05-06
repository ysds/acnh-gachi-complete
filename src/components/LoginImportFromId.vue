<template>
  <Card title="他のアカウントからインポート">
    <p>
      他のガチコンプアカウントからデータをコピーできます。このガチコンプのデータはすべて上書きされます。
    </p>
    <p class="small" style="font-weight: 700; margin-bottom: 0.5rem">
      以下のテキストボックスに、インポートしたい相手のガチコンプのIDを貼り付けて、インポートボタンを押してください。
      相手のガチコンプの ID は、シェア URL の
      <code>uid=</code>
      以降の文字列で確認できます。
    </p>
    <p
      class="small"
      style="font-size: 12px; margin-bottom: 0.5rem; word-break: break-all"
    >
      例: https://ysds.github.io/acnh-gachi-complete/share2/exchange/?uid=<code
        style="color: red"
        >XXXXXXXXXXXXXXXXXXXXXXXXXXXX</code
      >
    </p>
    <Input
      placeholder="相手のガチコンプID"
      v-model="inputValue"
      @focus="$event.target.select()"
      @input="message = ''"
      class="mb-4"
    />
    <p v-if="message" class="message">
      {{ message }}
    </p>
    <div style="text-align: center">
      <Button cta @click="preCheck" :disabled="inputValue === ''"
        >インポート</Button
      >
    </div>
    <Modal :show="isShowModal" @close="isShowModal = false" v-if="importData">
      <template slot="header">
        以下のアカウントのデータをインポートしてもよろしいですか？</template
      >
      <template slot="body">
        <div>
          <p>
            名前: {{ importData.userName }} さん
            <template v-if="importData.islandName"
              ><br />島名: {{ importData.islandName }} 島
            </template>
          </p>
          <Button cta @click="runImport">インポート</Button>
        </div>
      </template>
    </Modal>
    <Modal :show="isShowCompleteModal" @close="isShowCompleteModal = false">
      <template slot="header"> データをインポートしました。 </template>
      <template slot="body">
        <div>
          <Button block @click="isShowCompleteModal = false">OK</Button>
        </div>
      </template>
    </Modal>
  </Card>
</template>

<script>
import firebase from "../plugins/firebase";
import LZString from "lz-string";

import Card from "./Card.vue";
import Input from "./Input.vue";
import Button from "./Button.vue";
import Modal from "./Modal.vue";

const db = firebase.firestore();

export default {
  components: {
    Card,
    Input,
    Button,
    Modal,
  },
  data() {
    return {
      inputValue: "",
      importData: undefined,
      isShowModal: false,
      isShowCompleteModal: false,
      message: "",
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    preCheck: function () {
      const self = this;
      db.collection("users")
        .doc(self.inputValue)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            self.message = "";
            self.importData = doc.data();
            self.isShowModal = true;
          } else {
            self.message =
              "データを読み込めませんでした。ID が間違えているか、データが存在しません。";
          }
        })
        .catch(function () {
          self.message =
            "データを読み込めませんでした。ID が間違えているか、データが存在しません。";
        });
    },
    runImport: function () {
      const data = this.importData;

      const collectedValue = data.collected || "";
      const collected = JSON.parse(
        LZString.decompressFromUTF16(collectedValue)
      );
      const shareCategories = data.shareCategories || [];
      const wishlistValue = data.wishlist || "";
      const wishlist = JSON.parse(LZString.decompressFromUTF16(wishlistValue));
      const stocklistValue = data.stocklist || "";
      const stocklist = JSON.parse(
        LZString.decompressFromUTF16(stocklistValue)
      );
      const partnerlistValue = data.partnerlist || "";
      const partnerlist = JSON.parse(
        LZString.decompressFromUTF16(partnerlistValue)
      );

      let updateIndex = this.$store.getters.localUpdateIndex || 0;
      updateIndex++;

      this.$store.commit("updateLocalCollectedData", {
        collected,
        updateIndex,
      });
      this.$store.commit("updateShareCategories", shareCategories);
      this.$store.commit("updateWishlist", wishlist);
      this.$store.commit("updateStocklist", stocklist);
      this.$store.commit("updatePartnerlist", partnerlist);

      this.isShowModal = false;
      this.isShowCompleteModal = true;
      this.inputValue = "";
      this.message = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  font-size: 12px;
  font-weight: 700;
}

p,
ul,
ol {
  font-size: 13px;
}
</style>
