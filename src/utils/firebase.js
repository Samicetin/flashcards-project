import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDP4qE7mzx66FuKJpSEYhzCJZFl--wCKYI",
  authDomain: "quizwebsite-a65fc.firebaseapp.com",
  projectId: "quizwebsite-a65fc",
  storageBucket: "quizwebsite-a65fc.firebasestorage.app",
  messagingSenderId: "434896288333",
  appId: "1:434896288333:web:740673b4339703acfd3a04"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
