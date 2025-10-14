import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFjTzAxLwN6TlS9fX1lhgxw5nbaO0djQk",
  authDomain: "sassed-685dc.firebaseapp.com",
  databaseURL: "https://sassed-685dc-default-rtdb.firebaseio.com",
  projectId: "sassed-685dc",
  storageBucket: "sassed-685dc.firebasestorage.app",
  messagingSenderId: "422498219084",
  appId: "1:422498219084:web:fc85a1151c9743a3af70e9",
  measurementId: "G-MJBVGRJF1Q",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
