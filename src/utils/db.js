import LZString from "lz-string";
import isEqual from "lodash/isEqual";
import store from "../store";
import firebase from "../plugins/firebase";

const db = firebase.firestore();
let user;
let localCollected;
let localUpdateIndex;
let cloudCollected;
let cloudUpdateIndex;
let lastSyncCollected = {};

const initDataFromStore = function() {
  user = store.getters.user;
  localCollected = store.getters.localCollectedData;
  localUpdateIndex = store.getters.localUpdateIndex;
  cloudCollected = store.getters.cloudCollectedData;
  cloudUpdateIndex = store.getters.cloudUpdateIndex;
};

const updateCloudData = function() {
  if (user && user.uid) {
    const updateIndex = localUpdateIndex;
    db.collection("users")
      .doc(user.uid)
      .update({
        lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
        collected: LZString.compressToUTF16(JSON.stringify(localCollected)),
        updateIndex
      })
      .then(function() {})
      .catch(function() {});
    store.commit("updateCloudCollectedData", {
      collected: localCollected,
      updateIndex
    });
  }
};

const updateLocalData = function() {
  store.commit("updateLocalCollectedData", {
    collected: cloudCollected,
    updateIndex: cloudUpdateIndex
  });
};

export function syncCollectedData() {
  initDataFromStore();

  if (
    localUpdateIndex > cloudUpdateIndex &&
    !isEqual(localCollected, lastSyncCollected) // 最終同期データと異なる時のみ同期する。
  ) {
    lastSyncCollected = Object.assign({}, localCollected);
    updateCloudData();
  } else if (localUpdateIndex < cloudUpdateIndex) {
    lastSyncCollected = Object.assign({}, cloudCollected);
    updateLocalData();
  }
}

export function loadFirebaseData() {
  initDataFromStore();

  if (user && user.uid) {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const data = doc.data();
          const collectedValue = data.collected || {};
          const collected = JSON.parse(
            LZString.decompressFromUTF16(collectedValue)
          );
          const updateIndex = data.updateIndex || 0;
          const userName = data.userName || user.displayName || null;
          const islandName = data.islandName || null;
          const shareCategories = data.shareCategories || [];

          store.commit("initCloudCollectedData", {
            collected,
            updateIndex
          });
          store.commit("updateUserName", userName);
          store.commit("updateIslandName", islandName);
          store.commit("updateShareCategories", shareCategories);
        } else {
          const userName = user.displayName || null;
          db.collection("users")
            .doc(user.uid)
            .set({
              userName
            });
          store.commit("updateUserName", userName);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}
