// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "coding-fights.firebaseapp.com",
  projectId: "coding-fights",
  storageBucket: "coding-fights.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};

// Firebase 초기화 및 Firestore DB 내보내기
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);