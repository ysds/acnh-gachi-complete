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
let localWishlist;
let cloudWishlist;
let lastSyncWishlist;

const initDataFromStore = function () {
  user = store.getters.user;
  localCollected = store.getters.localCollectedData;
  localUpdateIndex = store.getters.localUpdateIndex;
  localWishlist = store.getters.wishlist;
  cloudCollected = store.getters.cloudCollectedData;
  cloudUpdateIndex = store.getters.cloudUpdateIndex;
  cloudWishlist = store.getters.cloudWishlist;
};

const updateCloudData = function () {
  if (user && user.uid) {
    const updateIndex = localUpdateIndex;
    db.collection("users")
      .doc(user.uid)
      .update({
        lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
        collected: LZString.compressToUTF16(JSON.stringify(localCollected)),
        wishlist: LZString.compressToUTF16(JSON.stringify(localWishlist)),
        updateIndex,
      })
      .then(function () {})
      .catch(function () {});
    store.commit("updateCloudCollectedData", {
      collected: localCollected,
      updateIndex,
    });
    store.commit("updateCloudWishlist", localWishlist);
  }
};

const updateLocalData = function () {
  store.commit("updateLocalCollectedData", {
    collected: cloudCollected,
    updateIndex: cloudUpdateIndex,
  });
  store.commit("updateWishlist", cloudWishlist);
};

export function syncData() {
  initDataFromStore();

  if (
    localUpdateIndex > cloudUpdateIndex &&
    // 最終同期データと異なる時のみ同期する。
    (!isEqual(localCollected, lastSyncCollected) ||
      !isEqual(localWishlist, lastSyncWishlist))
  ) {
    lastSyncCollected = Object.assign({}, localCollected);
    lastSyncWishlist = localWishlist;
    updateCloudData();
  } else if (localUpdateIndex < cloudUpdateIndex) {
    lastSyncCollected = Object.assign({}, cloudCollected);
    lastSyncWishlist = cloudWishlist;
    updateLocalData();
  }
}

export function loadFirebaseData() {
  initDataFromStore();

  if (user && user.uid) {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          const data = doc.data();

          const collectedValue = data.collected || "";
          const collected = JSON.parse(
            LZString.decompressFromUTF16(collectedValue)
          );
          const updateIndex = data.updateIndex || 0;
          const userName = data.userName || user.displayName || null;
          const islandName = data.islandName || null;
          const shareCategories = data.shareCategories || [];
          const wishlistValue = data.wishlist || "";
          const wishlist = JSON.parse(
            LZString.decompressFromUTF16(wishlistValue)
          );

          store.commit("initCloudCollectedData", {
            collected,
            updateIndex,
          });
          store.commit("updateUserName", userName);
          store.commit("updateIslandName", islandName);
          store.commit("updateShareCategories", shareCategories);
          store.commit("updateCloudWishlist", wishlist);
        } else {
          const userName = user.displayName || null;
          db.collection("users").doc(user.uid).set({
            userName,
          });
          store.commit("updateUserName", userName);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
