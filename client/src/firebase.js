// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "all-aboard-28766.firebaseapp.com",
  projectId: "all-aboard-28766",
  storageBucket: "all-aboard-28766.appspot.com",
  messagingSenderId: "1098861570631",
  appId: "1:1098861570631:web:23a7b353096cc557d45f62",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
