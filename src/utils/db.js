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
let localStocklist;
let cloudStocklist;
let lastSyncStocklist;
let localPartnerlist;
let cloudPartnerlist;
let lastSyncPartnerlist;

const initDataFromStore = function () {
  user = store.getters.user;
  localCollected = store.getters.localCollectedData;
  localUpdateIndex = store.getters.localUpdateIndex;
  localWishlist = store.getters.wishlist;
  localStocklist = store.getters.stocklist;
  localPartnerlist = store.getters.partnerlist;
  cloudCollected = store.getters.cloudCollectedData;
  cloudUpdateIndex = store.getters.cloudUpdateIndex;
  cloudWishlist = store.getters.cloudWishlist;
  cloudStocklist = store.getters.cloudStocklist;
  cloudPartnerlist = store.getters.cloudPartnerlist;
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
        stocklist: LZString.compressToUTF16(JSON.stringify(localStocklist)),
        partnerlist: LZString.compressToUTF16(JSON.stringify(localPartnerlist)),
        updateIndex,
      })
      .then(function () {})
      .catch(function () {});
    store.commit("updateCloudCollectedData", {
      collected: localCollected,
      updateIndex,
    });
    store.commit("updateCloudWishlist", localWishlist);
    store.commit("updateCloudStocklist", localStocklist);
    store.commit("updateCloudPartnerlist", localPartnerlist);
  }
};

const updateLocalData = function () {
  store.commit("updateLocalCollectedData", {
    collected: cloudCollected,
    updateIndex: cloudUpdateIndex,
  });
  store.commit("updateWishlist", cloudWishlist);
  store.commit("updateStocklist", cloudStocklist);
  store.commit("updatePartnerlist", cloudPartnerlist);
};

export function syncData() {
  initDataFromStore();

  if (
    localUpdateIndex > cloudUpdateIndex &&
    // 最終同期データと異なる時のみ同期する。
    (!isEqual(localCollected, lastSyncCollected) ||
      !isEqual(localWishlist, lastSyncWishlist) ||
      !isEqual(localStocklist, lastSyncStocklist) ||
      !isEqual(localPartnerlist, lastSyncPartnerlist))
  ) {
    lastSyncCollected = Object.assign({}, localCollected);
    lastSyncWishlist = localWishlist;
    lastSyncStocklist = localStocklist;
    lastSyncPartnerlist = localPartnerlist;
    updateCloudData();
  } else if (localUpdateIndex < cloudUpdateIndex) {
    lastSyncCollected = Object.assign({}, cloudCollected);
    lastSyncWishlist = cloudWishlist;
    lastSyncStocklist = cloudStocklist;
    lastSyncPartnerlist = cloudPartnerlist;
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
          const stocklistValue = data.stocklist || "";
          const stocklist = JSON.parse(
            LZString.decompressFromUTF16(stocklistValue)
          );
          const partnerlistValue = data.partnerlist || "";
          const partnerlist = JSON.parse(
            LZString.decompressFromUTF16(partnerlistValue)
          );

          store.commit("initCloudCollectedData", {
            collected,
            updateIndex,
          });
          store.commit("updateUserName", userName);
          store.commit("updateIslandName", islandName);
          store.commit("updateShareCategories", shareCategories);
          store.commit("updateCloudWishlist", wishlist);
          store.commit("updateCloudStocklist", stocklist);
          store.commit("updateCloudPartnerlist", partnerlist);
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
