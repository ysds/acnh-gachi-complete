import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    isLogin: null,
    collectedData: null
  },
  mutations: {
    authStateChange(state, user) {
      state.user = user;
    },
    loginStateChange(state, nextState) {
      state.isLogin = nextState;
    },
    collectedDataChange(state, collectedData) {
      state.collectedData = collectedData;
    },
    itemCollectedDataChange(state, payload) {
      if (payload.newItemCollected === "") {
        delete state.collectedData[payload.name];
      } else {
        state.collectedData[payload.name] = payload.newItemCollected;
      }
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isLogin(state) {
      return state.isLogin;
    },
    collectedData(state) {
      return state.collectedData;
    }
  }
});
