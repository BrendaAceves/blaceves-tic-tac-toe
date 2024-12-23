// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDX6mIdETDT8kL_iAXoXDDMDftiEzL5rR0",
  authDomain: "blueprint-tic-tac-toe-c2e5e.firebaseapp.com",
  projectId: "blueprint-tic-tac-toe-c2e5e",
  storageBucket: "blueprint-tic-tac-toe-c2e5e.firebasestorage.app",
  messagingSenderId: "787823611359",
  appId: "1:787823611359:web:5bdb730eab8f1bf2a2086a",
  measurementId: "G-ZL6MQCKHC0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

