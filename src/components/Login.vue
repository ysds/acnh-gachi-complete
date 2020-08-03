<template>
  <div class="login">
    <div class="login-header">
      <h2 class="login-title">ログイン</h2>
      <div class="close">
        <CloseButton @click="close" />
      </div>
    </div>
    <div class="login-body">
      <template v-if="isLogin && user">
        <img :src="user.photoURL" alt="Avatar" class="avatar" />
        <p>{{ user.displayName }}</p>
        <button type="button" class="btn" @click="logout">
          ログアウト
        </button>
      </template>
      <template v-else-if="isLogin === false">
        <button type="button" class="btn btn-google" @click="login('google')">
          <img
            src="../assets/google.svg"
            width="24px"
            height="24px"
            style="margin-right: 1rem"
          />
          Google でログイン
        </button>
        <button type="button" class="btn btn-google" @click="login('google')">
          <img
            src="../assets/Twitter_Logo_Blue.svg"
            width="40px"
            height="40px"
            style="margin-right: .5rem"
          />
          Twitter でログイン
        </button>
      </template>
    </div>
  </div>
</template>
<script>
import Auth from "../utils/auth";
import CloseButton from "../components/CloseButton";

export default {
  name: "Login",
  components: {
    CloseButton
  },
  computed: {
    user() {
      return this.$store.getters.user;
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
      Auth.logout();
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
}

.login-header {
  position: relative;
  text-align: center;
  padding: 0.5rem;
  line-height: 64px;
}

.close {
  position: absolute;
  top: 8px;
  right: 16px;
}

.login-title {
  margin-bottom: 0;
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
  margin-bottom: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  min-height: 50px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0 1rem;
  border: 1px solid #ccc;
  border-radius: 1rem;
  background-color: #fff;
  font-weight: 700;
}
</style>
