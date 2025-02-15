import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-k0zMsV171lcnsiiESfAxNXl98bX_fyc",
  authDomain: "hrams-7e40b.firebaseapp.com",
  projectId: "hrams-7e40b",
  storageBucket: "hrams-7e40b.firebasestorage.app",
  messagingSenderId: "994710318332",
  appId: "1:994710318332:web:25ddf0cb4a5b8d9e62bb79",
  measurementId: "G-9R0M5JNLJF",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { firebaseConfig, db };
