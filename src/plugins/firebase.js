import firebase from "@firebase/app";
import "@firebase/auth";
import "firebase/firestore";
import "firebase/functions";

var config = {
  apiKey: "AIzaSyD-N7qRjygk28zMZ2JSAxROBg_MV8dwe9s",
  authDomain: "acnh-gachi-complete.firebaseapp.com",
  databaseURL: "https://acnh-gachi-complete.firebaseio.com",
  projectId: "acnh-gachi-complete",
  storageBucket: "acnh-gachi-complete.appspot.com",
  messagingSenderId: "281864586378",
  appId: "1:281864586378:web:c362cf8f36675c36c89973",
};

firebase.initializeApp(config);

export default firebase;
