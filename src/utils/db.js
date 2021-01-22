import LZString from "lz-string";
import store from "../store";
import firebase from "../plugins/firebase";

const db = firebase.firestore();
let user;
let localCollected;
let localUpdateIndex;
let cloudCollected;
let cloudUpdateIndex;

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
  if (localUpdateIndex > cloudUpdateIndex) {
    updateCloudData();
  } else if (localUpdateIndex < cloudUpdateIndex) {
    updateLocalData();
  }
}
