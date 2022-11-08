import store from "../store";
import firebase from "../plugins/firebase";

export default {
  init() {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth().onAuthStateChanged((_user) => {
      const user = Object.assign({}, _user);

      // Update latest data
      if (user.providerData) {
        user.providerData.forEach(function (profile) {
          user.displayName = profile.displayName;
          user.photoURL = profile.photoURL;
        });
      }

      store.commit("authStateChange", user);
      store.commit("loginStateChange", user.uid ? true : false);
    });
  },
  login(providerName, callback) {
    const provider =
      providerName === "google"
        ? new firebase.auth.GoogleAuthProvider()
        : new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(callback);
  },
  logout() {
    firebase.auth().signOut();
    store.commit("authStateChange", {});
    store.commit("loginStateChange", false);
  },
  delete() {
    const user = firebase.auth().currentUser;
    user
      .delete()
      .then(() => {
        // User deleted.
      })
      .catch(() => {
        // An error ocurred
        // ...
      });
    store.commit("authStateChange", {});
    store.commit("loginStateChange", false);
  },
};
