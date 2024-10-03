// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKibeVB6bwk3A5TgMiW0GYlSOE9GQzeDw",
  authDomain: "torrent-8aef6.firebaseapp.com",
  databaseURL: "https://torrent-8aef6-default-rtdb.firebaseio.com",
  projectId: "torrent-8aef6",
  storageBucket: "torrent-8aef6.appspot.com",
  messagingSenderId: "208551240840",
  appId: "1:208551240840:web:8c2e73812407d25e67ab3d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
