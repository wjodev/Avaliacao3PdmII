import firebase from "firebase/compat/app";

import "firebase/compat/auth";

import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {

  apiKey: "AIzaSyAaLbEhzjC1j5gclQ1btZndmHANpMoPBNI",
  authDomain: "avaliacaoiii-pdmii.firebaseapp.com",
  projectId: "avaliacaoiii-pdmii",
  storageBucket: "avaliacaoiii-pdmii.appspot.com",
  messagingSenderId: "271966400407",
  appId: "1:271966400407:web:57633e6d21f7e93da31ed2"

};



let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()
const firestore = firebase.firestore()
const storage = firebase.storage()

export { auth, firestore, storage };