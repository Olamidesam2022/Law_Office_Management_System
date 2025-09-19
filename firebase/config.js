import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBBjCs24oW8S63bp726RIs12yQKk2zjgC0",
  authDomain: "legal-case-manager-5cc03.firebaseapp.com",
  projectId: "legal-case-manager-5cc03",
  storageBucket: "legal-case-manager-5cc03.firebasestorage.app",
  messagingSenderId: "112261307186",
  appId: "1:112261307186:web:8d1a12359a81979ed2552b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
