// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBolJEPIN0mOfXpAEmMGmXP0WYaGw2yR_Q",
  authDomain: "mobil-odev-c0519.firebaseapp.com",
  databaseURL: "https://mobil-odev-c0519-default-rtdb.firebaseio.com/",
  projectId: "mobil-odev-c0519",
  storageBucket: "mobil-odev-c0519.appspot.com",
  messagingSenderId: "423907076965",
  appId: "1:423907076965:web:cd54ad535d1f781fac4f8c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };
