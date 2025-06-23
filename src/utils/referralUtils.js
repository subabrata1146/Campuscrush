// src/utils/referralUtils.js
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { addCoins } from "./coinUtils";

// Called when someone uses a referral code during registration
export const updateReferral = async (referrerUid, newUserUid) => {
  const refDoc = doc(db, "referrals", referrerUid);
  const snap = await getDoc(refDoc);

  // Step 1: Check if user already referred
  if (snap.exists()) {
    const data = snap.data();
    if (data.usedBy.includes(newUserUid)) return; // prevent duplicate
    await updateDoc(refDoc, {
      usedBy: arrayUnion(newUserUid),
    });
  } else {
    await setDoc(refDoc, {
      usedBy: [newUserUid],
    });
  }

  // Step 2: Check how many referred users have premium
  const updatedSnap = await getDoc(refDoc);
  const referredUids = updatedSnap.data().usedBy || [];

  let premiumCount = 0;

  for (let uid of referredUids) {
    const userSnap = await getDoc(doc(db, "users", uid));
    if (userSnap.exists() && userSnap.data().premium === true) {
      premiumCount++;
    }
  }

  // Step 3: If 2+ referred friends are premium, reward 1 coin
  if (premiumCount >= 2) {
    await addCoins(1); // Give 1 coin to referrer
  }
};
