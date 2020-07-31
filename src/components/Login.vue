<template>
  <div class="login">
    <div class="login-body">
      <h2 class="title">ログイン</h2>
      <button type="button" class="search-btn" @click="close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 50 50"
        >
          <path
            fill="#231F20"
            d="M9.016 40.837a1.001 1.001 0 001.415-.001l14.292-14.309 14.292 14.309a1 1 0 001.416-1.413L26.153 25.129 40.43 10.836a1 1 0 10-1.415-1.413L24.722 23.732 10.43 9.423a1 1 0 10-1.415 1.413l14.276 14.293L9.015 39.423a1 1 0 00.001 1.414z"
          />
        </svg>
      </button>
      <div v-if="isLogin" class="navbar-item">
        <p class="navbar-item">{{ user.displayName }}</p>
        <button type="button" class="btn" @click="logout">
          ログアウト
        </button>
      </div>
      <div v-else-if="isLogin === false">
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
      </div>
    </div>
  </div>
</template>
<script>
import Auth from "../utils/auth";

export default {
  name: "Login",
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
}

.login-body {
  padding: 1.5rem;
  max-width: 600px;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

.title {
  margin-bottom: 3rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  min-height: 50px;
  margin-bottom: 1rem;
  padding: 0 1rem;
  border: 1px solid #ccc;
  border-radius: 1rem;
  background-color: #fff;
  font-weight: 700;
}

.search-btn {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  flex-shrink: 0;
  margin-left: auto;
  width: 64px;
  height: 64px;
  text-align: center;
  line-height: 64px;
  border: 0;
  background-color: #fff;
  pointer-events: auto;
}
</style>
