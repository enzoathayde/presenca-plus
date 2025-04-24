import { initializeApp } from "firebase/app";


export const firebaseConfig = {
  apiKey: "AIzaSyD1Xl00PKlNIUMe_TUzHTaziKM6biRT8V8",
  authDomain: "presenca-plus.firebaseapp.com",
  projectId: "presenca-plus",
  storageBucket: "presenca-plus.firebasestorage.app",
  messagingSenderId: "547504148690",
  appId: "1:547504148690:web:7c04f0ed99cf6ec9aadd0b",
  measurementId: "G-74J26G2EP8"
};

export const firebaseApp = initializeApp(firebaseConfig);