// src/pages/CoinShop.js
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // ✅ Step 1: Import navigate

export default function CoinShop() {
  const [coins, setCoins] = useState(0);
  const navigate = useNavigate(); // ✅ Step 2: Initialize navigate

  const fetchCoins = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, 'coins', user.uid);
    const coinDoc = await getDoc(docRef);
    if (coinDoc.exists()) {
      setCoins(coinDoc.data().balance);
    } else {
      setCoins(0);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-4">
      <h2 className="text-2xl font-bold mb-4">💰 Coin Shop</h2>
      <p className="text-lg mb-2">You have <span className="font-bold">{coins}</span> coin(s)</p>
      <p className="text-sm text-gray-500">
        Coins can be used to send direct messages to anyone (even without a match)
      </p>

      <div className="mt-6 bg-yellow-100 p-4 rounded shadow">
        <p className="font-semibold text-pink-600">Want more coins?</p>
        <p className="text-sm">Please contact CampusCrush team or admin to purchase.</p>
      </div>

      {/* ✅ Step 3: Add direct message button here */}
      <button
        onClick={() => navigate('/direct-message')}
        className="mt-4 bg-pink-500 text-white px-4 py-2 rounded"
      >
        Send Direct Message (1 Coin)
      </button>
    </div>
  );
}
