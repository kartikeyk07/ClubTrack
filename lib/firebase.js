// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4Wutj3KI7lYRN34LgmLVfYaJdvLREbJY",
  authDomain: "rotary-expense-tracker.firebaseapp.com",
  projectId: "rotary-expense-tracker",
  storageBucket: "rotary-expense-tracker.firebasestorage.app",
  messagingSenderId: "715636938249",
  appId: "1:715636938249:web:7d22dd03dd34d3a8f48ad8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }