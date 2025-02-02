import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDN_oYc_0_toCe8RHfmWWcwwmOcgIkYZds",
    authDomain: "gurohub.firebaseapp.com",
    projectId: "gurohub",
    storageBucket: "gurohub.appspot.com",
    messagingSenderId: "659324911230",
    appId: "1:659324911230:web:4200a7d7bf0218c204a22f",
    measurementId: "G-5WSPCC1MF1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export { firebaseConfig, db }

