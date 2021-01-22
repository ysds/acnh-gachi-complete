import Vue from "vue";
import Vuex from "vuex";
import localforage from "localforage";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    activeNav: null,
    isOpenDrawer: false,
    user: null,
    isLogin: null,
    userName: null,
    islandName: null,
    localCollectedData: null,
    localUpdateIndex: null,
    cloudCollectedData: null,
    cloudUpdateIndex: null,
    sharedCollected: null,
    sharedUserName: null,
    sharedIslandName: null,
    shareCategories: [],
    sharedShareCategories: [],
    isShowDropdown: false,
    isDoneSyncCloudFirstTime: false
  },
  mutations: {
    changeNav(state, nextNav) {
      localforage.setItem("nav", nextNav);
      state.activeNav = nextNav;
    },
    toggleDrawer(state) {
      state.isOpenDrawer = !state.isOpenDrawer;
    },
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
    },
    updateUserName(state, name) {
      state.userName = name;
    },
    updateIslandName(state, name) {
      state.islandName = name;
    },
    updateSharedCollected(state, data) {
      state.sharedCollected = data;
    },
    updateSharedUserName(state, data) {
      state.sharedUserName = data;
    },
    updateSharedIslandName(state, data) {
      state.sharedIslandName = data;
    },
    updateShareCategories(state, data) {
      state.shareCategories = data;
    },
    updateSharedShareCategories(state, data) {
      state.sharedShareCategories = data;
    },
    isShowDropdown(state, isShow) {
      state.isShowDropdown = isShow;
    },
    isDoneSyncCloudFirstTime(state, payload) {
      state.isDoneSyncCloudFirstTime = payload;
    }
  },
  getters: {
    activeNav(state) {
      return state.activeNav;
    },
    isOpenDrawer(state) {
      return state.isOpenDrawer;
    },
    user(state) {
      return state.user;
    },
    userName(state) {
      return state.userName;
    },
    islandName(state) {
      return state.islandName;
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
    },
    sharedCollected(state) {
      return state.sharedCollected;
    },
    sharedUserName(state) {
      return state.sharedUserName;
    },
    sharedIslandName(state) {
      return state.sharedIslandName;
    },
    shareCategories(state) {
      return state.shareCategories;
    },
    sharedShareCategories(state) {
      return state.sharedShareCategories;
    },
    isShowDropdown(state) {
      return state.isShowDropdown;
    },
    isDoneSyncCloudFirstTime(state) {
      return state.isDoneSyncCloudFirstTime;
    }
  }
});
