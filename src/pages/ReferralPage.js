import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function ReferralPage() {
  const [code, setCode] = useState('');
  const [purchases, setPurchases] = useState(0);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const fetchReferral = async () => {
      const user = auth.currentUser;
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCode(data.referralCode);
        setPurchases(data.referredPurchases || 0);
        setClaimed(data.rewardsClaimed || false);
      }
    };
    fetchReferral();
  }, []);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold">🎁 Referral Program</h2>
      <p className="mt-4">Invite friends using this code:</p>
      <div className="bg-gray-200 rounded p-2 mt-2">{code}</div>

      <p className="mt-4">
        <strong>{purchases}</strong> referred friends have purchased.
      </p>
      {claimed ? (
        <p className="text-green-600 mt-2">✅ Reward already claimed!</p>
      ) : (
        <p className="text-blue-600 mt-2">Refer 3 friends. If 2 buy, you get 1 coin 🎉</p>
      )}
    </div>
  );
}
