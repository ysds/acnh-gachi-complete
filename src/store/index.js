import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    isLogin: null,
    userData: null
  },
  mutations: {
    authStateChange(state, user) {
      state.user = user;
    },
    loginStateChange(state, nextState) {
      state.isLogin = nextState;
    },
    userDataChange(state, userData) {
      state.userData = userData;
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isLogin(state) {
      return state.isLogin;
    },
    userData(state) {
      return state.userData;
    }
  }
});
