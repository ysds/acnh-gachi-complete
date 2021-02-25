<template>
  <div class="login">
    <div class="login-header">
      <h2 class="login-title">
        <template v-if="isLogin">設定</template>
        <template v-else>ログイン</template>
      </h2>
      <div class="close">
        <CloseButton @click="close" />
      </div>
    </div>
    <div class="login-body">
      <template v-if="isLogin && user">
        <img :src="user.photoURL" alt="Avatar" class="avatar" />
      </template>
      <div v-else-if="isLogin === false" class="mb-6">
        <p style="font-size: 14px;">
          ログインすると、データが自動的にクラウドに保存され、シェア機能を使えるようになります。
        </p>
        <Button block @click="login('google')">
          <img
            src="../assets/google.svg"
            width="24px"
            height="24px"
            style="margin-right: 1rem"
          />
          Google でログイン
        </Button>
        <Button block @click="login('twitter')">
          <img
            src="../assets/Twitter_Logo_Blue.svg"
            width="40px"
            height="40px"
            style="margin-right: .5rem"
          />
          Twitter でログイン
        </Button>
      </div>

      <LoginCollected />

      <template v-if="isLogin && user">
        <LoginName :userName="userName" @change="saveName" />
        <LoginIslandName :islandName="islandName" @change="saveIslandName" />
        <LoginShare />
        <Card title="ID">
          <p>{{ user.uid }}</p>
          <p class="small">
            あなたの固有IDです。シェア機能使用時の URL として使用されます。
          </p>
        </Card>
      </template>

      <LoginCatalogScanner />
      <LoginImport />

      <template v-if="isLogin && user">
        <Button block @click="logout">
          ログアウト
        </Button>
        <p class="small mt-4">
          ログアウトするとブラウザに保存されているデータはクリアされます。再度ログインすることで、クラウドからデータを復元できます。
        </p>
      </template>
    </div>
  </div>
</template>
<script>
import firebase from "../plugins/firebase";
import Auth from "../utils/auth";
import { syncCollectedData } from "../utils/db.js";

import CloseButton from "../components/CloseButton";
import Button from "../components/Button";
import Card from "../components/Card";
import LoginName from "../components/LoginName";
import LoginIslandName from "../components/LoginIslandName";
import LoginShare from "../components/LoginShare";
import LoginImport from "../components/LoginImport";
import LoginCollected from "../components/LoginCollected";
import LoginCatalogScanner from "../components/LoginCatalogScanner";

const db = firebase.firestore();

export default {
  name: "Login",
  components: {
    CloseButton,
    Button,
    Card,
    LoginName,
    LoginIslandName,
    LoginShare,
    LoginImport,
    LoginCollected,
    LoginCatalogScanner
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userName() {
      return this.$store.getters.userName;
    },
    islandName() {
      return this.$store.getters.islandName;
    },
    isLogin() {
      return this.$store.getters.isLogin;
    }
  },
  methods: {
    login(provider) {
      Auth.login(provider);
    },
    logout() {
      syncCollectedData();
      Auth.logout();
      this.$vlf.clear(() => {
        window.location.reload();
      });
    },
    close() {
      this.$emit("close");
    },
    saveName(newName) {
      db.collection("users")
        .doc(this.user.uid)
        .update({
          userName: newName
        });
      this.$store.commit("updateUserName", newName);
    },
    saveIslandName(newName) {
      db.collection("users")
        .doc(this.user.uid)
        .update({
          islandName: newName
        });
      this.$store.commit("updateIslandName", newName);
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  position: fixed;
  z-index: 1100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
  user-select: text;
}

.login-header {
  position: relative;
  text-align: center;
  padding: 0.5rem;
  line-height: 64px;
}

.login-title {
  margin-bottom: 0;
}

.close {
  position: absolute;
  top: 8px;
  right: 16px;
}

.login-body {
  padding: 1.5rem;
  max-width: 600px;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 2rem;
}
</style>
