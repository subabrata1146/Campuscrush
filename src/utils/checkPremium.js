// src/utils/checkPremium.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const checkPremiumStatus = async (uid) => {
  const docRef = doc(db, "premiumUsers", uid);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() && docSnap.data().isPremium === true;
};
