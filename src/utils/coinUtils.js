// src/utils/coinUtils.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";

// Add coins to current user
export const addCoins = async (amount) => {
  const user = auth.currentUser;
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const current = snap.data().coins || 0;
  await updateDoc(ref, { coins: current + amount });
};

// Spend coins
export const spendCoins = async (amount) => {
  const user = auth.currentUser;
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const current = snap.data().coins || 0;

  if (current >= amount) {
    await updateDoc(ref, { coins: current - amount });
    return true;
  } else {
    alert("Not enough coins!");
    return false;
  }
};
