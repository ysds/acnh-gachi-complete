import Vue from "vue";
import Vuex from "vuex";
import localforage from "localforage";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    isLogin: null,
    localCollectedData: null,
    localUpdateIndex: null,
    cloudCollectedData: null,
    cloudUpdateIndex: null
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
      state.localUpdateIndex = payload.updateIndex;
    },
    initCloudCollectedData(state, payload) {
      state.cloudCollectedData = payload.collected;
      state.cloudUpdateIndex = payload.updateIndex;
    },
    updateLocalCollectedDataByItem(state, payload) {
      if (payload.itemCollectedData === "") {
        Vue.delete(state.localCollectedData, payload.itemName);
      } else {
        Vue.set(
          state.localCollectedData,
          payload.itemName,
          payload.itemCollectedData
        );
      }
      localforage.setItem("collected", state.localCollectedData);
      state.localUpdateIndex++;
      localforage.setItem("updateIndex", state.localUpdateIndex);
    },
    updateLocalCollectedDataBatch(state, payload) {
      const items = payload.items;
      const collectedArray = payload.collectedArray;
      for (let i = 0; i < items.length; i++) {
        if (collectedArray[i] === "") {
          Vue.delete(state.localCollectedData, items[i]);
        } else {
          Vue.set(state.localCollectedData, items[i], collectedArray[i]);
        }
      }
      localforage.setItem("collected", state.localCollectedData);
      state.localUpdateIndex++;
      localforage.setItem("updateIndex", state.localUpdateIndex);
    },
    updateLocalCollectedData(state, payload) {
      state.localCollectedData = {};
      const collected = payload.collected;
      const keys = Object.keys(collected);
      const values = Object.values(collected);
      for (let i = 0; i < keys.length; i++) {
        Vue.set(state.localCollectedData, keys[i], values[i]);
      }
      state.localUpdateIndex = payload.updateIndex;
      localforage.setItem("collected", state.localCollectedData);
      localforage.setItem("updateIndex", payload.updateIndex);
    },
    updateCloudCollectedData(state, payload) {
      state.cloudCollectedData = payload.collected;
      state.cloudUpdateIndex = payload.updateIndex;
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
    localUpdateIndex(state) {
      return state.localUpdateIndex;
    },
    cloudUpdateIndex(state) {
      return state.cloudUpdateIndex;
    }
  }
});
