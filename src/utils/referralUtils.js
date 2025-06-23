// src/utils/referralUtils.js
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { addCoins } from "./coinUtils";

export const updateReferral = async (referrerUid, newUserUid) => {
  const refDoc = doc(db, "referrals", referrerUid);
  const snap = await getDoc(refDoc);
  if (snap.exists()) {
    const data = snap.data();
    if (data.usedBy.includes(newUserUid)) return; // prevent self-referral
    await updateDoc(refDoc, {
      usedBy: arrayUnion(newUserUid),
    });
  } else {
    await setDoc(refDoc, {
      usedBy: [newUserUid],
    });
  }

  // Reward coins if at least 2 referred users bought premium (dummy check)
  const updatedSnap = await getDoc(refDoc);
  const referred = updatedSnap.data().usedBy || [];

  if (referred.length >= 2) {
    await addCoins(1); // 1 free DM = 1 coin
  }
};
