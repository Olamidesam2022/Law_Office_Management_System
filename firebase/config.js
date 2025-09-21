import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQ4lENyTV05WW-7hcnzsAAs-xVqOROiyU",
  authDomain: "lawmanagementsystem-e7480.firebaseapp.com",
  projectId: "lawmanagementsystem-e7480",
  storageBucket: "lawmanagementsystem-e7480.firebasestorage.app",
  messagingSenderId: "1072314616068",
  appId: "1:1072314616068:web:01b7bb7a146ba1d01d6851",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
