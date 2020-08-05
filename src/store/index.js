import Vue from "vue";
import Vuex from "vuex";
import localforage from "localforage";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    isLogin: null,
    localCollectedData: null,
    localLastUpdate: null,
    cloudCollectedData: null,
    cloudLastUpdate: null
  },
  mutations: {
    authStateChange(state, user) {
      state.user = user;
    },
    loginStateChange(state, nextState) {
      state.isLogin = nextState;
    },
    initLocalCollectedData(state, payload) {
      state.localCollectedData = Object.assign({}, payload.collected);
      state.localLastUpdate = payload.lastUpdate;
    },
    initCloudCollectedData(state, payload) {
      state.cloudCollectedData = payload.collected;
      state.cloudLastUpdate = payload.lastUpdate;
    },
    updateLocalCollectedDataByItem(state, payload) {
      let localCollectedData = state.localCollectedData;
      if (payload.newItemCollected === "") {
        delete localCollectedData[payload.name];
      } else {
        localCollectedData[payload.name] = payload.newItemCollected;
      }
      state.localCollectedData = Object.assign({}, localCollectedData);
      localforage.setItem("collected", state.localCollectedData);
      localforage.setItem("lastUpdate", state.localLastUpdate++);
    },
    updateLocalCollectedData(state, payload) {
      state.localCollectedData = Object.assign({}, payload.collected);
      state.localLastUpdate = payload.lastUpdate;
      localforage.setItem("collected", state.localCollectedData);
      localforage.setItem("lastUpdate", payload.lastUpdate);
    },
    updateCloudCollectedData(state, payload) {
      state.cloudCollectedData = payload.collected;
      state.cloudLastUpdate = payload.lastUpdate;
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isLogin(state) {
      return state.isLogin;
    },
    localCollectedData(state) {
      return state.localCollectedData;
    },
    cloudCollectedData(state) {
      return state.cloudCollectedData;
    },
    localLastUpdate(state) {
      return state.localLastUpdate;
    },
    cloudLastUpdate(state) {
      return state.cloudLastUpdate;
    }
  }
});
