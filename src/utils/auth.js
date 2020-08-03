import store from "../store";
import firebase from "../utils/firebase";

export default {
  init() {
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
