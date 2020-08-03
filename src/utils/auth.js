import store from "../store";
import firebase from "../plugins/firebase";

export default {
  init() {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth().authStateChange(user => {
      user = user ? user : {};
      store.commit("authStateChange", user);
      store.commit("loginStateChange", user.uid ? true : false);
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
    store.commit("authStateChange", {});
    store.commit("loginStateChange", false);
  }
};
