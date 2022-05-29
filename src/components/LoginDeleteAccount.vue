<template>
  <div>
    <Button block dangerText @click="isShowReAuthModal = true">
      アカウントの削除
    </Button>
    <p class="small mt-4">ガチコンンプのアカウントとデータを削除します。</p>
    <p class="small mt-4" style="color: #eb486b" v-if="message">
      ガチコンンプのアカウントとデータを削除します。
    </p>
    <Modal :show="isShowReAuthModal" @close="isShowReAuthModal = false">
      <template slot="header">
        この操作を続けるには再度ログインする必要があります。</template
      >
      <template slot="body">
        <Button block danger @click="reauth">ログイン</Button>
      </template>
    </Modal>
    <Modal :show="isShowDeleteModal" @close="isShowDeleteModal = false">
      <template slot="header">
        以下のガチコンプのアカウントとデータを本当に削除してもよろしいですか？</template
      >
      <template slot="body">
        <p style="font-weight: 700">{{ userName }}</p>
        <p class="small">
          ガチコンプのアカウントを削除しても、Twitter や Google
          とのアカウント連携の許可は解除されません。連携を解除する方法は、それぞれのサービスのヘルプをご参照ください。
        </p>
        <ul class="small">
          <li>
            <a
              target="_blank"
              rel="noopener"
              href="https://help.twitter.com/ja/managing-your-account/connect-or-revoke-access-to-third-party-apps"
              >Twitter の場合</a
            >
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener"
              href="https://support.google.com/accounts/answer/3466521?hl=ja"
              >Google の場合</a
            >
          </li>
        </ul>
        <Button block danger @click="deleteAccount"
          >アカウントを削除する</Button
        >
      </template>
    </Modal>
  </div>
</template>

<script>
import Button from "../components/Button";
import Modal from "../components/Modal";

import firebase from "../plugins/firebase";
import Auth from "../utils/auth";
const db = firebase.firestore();

export default {
  components: {
    Button,
    Modal,
  },
  props: {
    userName: String,
    user: Object,
    logout: Function,
  },
  data() {
    return {
      isShowReAuthModal: false,
      isShowDeleteModal: false,
      message: "",
    };
  },
  methods: {
    reauth() {
      const user = firebase.auth().currentUser;
      const providerId = user.providerData[0].providerId;

      const provider =
        providerId === "google.com"
          ? new firebase.auth.GoogleAuthProvider()
          : new firebase.auth.TwitterAuthProvider();

      user
        .reauthenticateWithPopup(provider)
        .then(() => {
          // User re-authenticated.
          this.isShowReAuthModal = false;
          this.isShowDeleteModal = true;
        })
        .catch(() => {
          // An error ocurred
          // ...
        });
    },
    deleteAccount() {
      this.massage = "";

      db.collection("users")
        .doc(this.user.uid)
        .delete()
        .then(() => {
          Auth.delete();
          this.logout();
        })
        .catch((error) => {
          this.massage = `削除に失敗しました: , ${error}`;
        });
    },
  },
};
</script>
