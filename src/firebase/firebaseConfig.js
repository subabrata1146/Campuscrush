import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBWO15LGY8dWZlcSVUPUS6l72apaKVbM7c",
  authDomain: "campuscrush-b18d6.firebaseapp.com",
  projectId: "campuscrush-b18d6",
    storageBucket: "campuscrush-b18d6.appspot.com",
  messagingSenderId: "776700696889",
  appId: "1:776700696889:web:d6d8ef9344a78dc33e30e8",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
