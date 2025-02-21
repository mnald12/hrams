import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCdat-rXkzHXYjtz6NqLUHPG4JZnSjvJYo",
  authDomain: "bgi-electrical.firebaseapp.com",
  projectId: "bgi-electrical",
  storageBucket: "bgi-electrical.appspot.com",
  messagingSenderId: "1090887408840",
  appId: "1:1090887408840:web:f3c6c1eb7a02ba4add19fd",
  measurementId: "G-RSSLLSHKN3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
