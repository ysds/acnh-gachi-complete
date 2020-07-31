import firebase from "@firebase/app";
import "@firebase/auth";
import store from "../store";

var config = {
  apiKey: "AIzaSyD-N7qRjygk28zMZ2JSAxROBg_MV8dwe9s",
  authDomain: "acnh-gachi-complete.firebaseapp.com",
  databaseURL: "https://acnh-gachi-complete.firebaseio.com",
  projectId: "acnh-gachi-complete",
  storageBucket: "acnh-gachi-complete.appspot.com",
  messagingSenderId: "281864586378",
  appId: "1:281864586378:web:c362cf8f36675c36c89973"
};

export default {
  init() {
    firebase.initializeApp(config);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth().onAuthStateChanged(user => {
      user = user ? user : {};
      store.commit("onAuthStateChanged", user);
      store.commit("onLoginStateChanged", user.uid ? true : false);
    });
  },
  login(providerName) {
    const provider =
      providerName === "google"
        ? new firebase.auth.GoogleAuthProvider()
        : new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  },
  logout() {
    firebase.auth().signOut();
    store.commit("onAuthStateChanged", {});
    store.commit("onLoginStateChanged", false);
  }
};
