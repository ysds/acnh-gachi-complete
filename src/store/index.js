import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    isLogin: null
  },
  mutations: {
    onAuthStateChanged(state, user) {
      state.user = user;
    },
    onLoginStateChanged(state, nextState) {
      state.isLogin = nextState;
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isLogin(state) {
      return state.isLogin;
    }
  }
});
