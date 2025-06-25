// src/pages/DirectMessage.js
import React, { useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'firebase/firestore';

export default function DirectMessage() {
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');

  const sendDM = async () => {
    const sender = auth.currentUser;

    if (!sender || !receiverId || !message.trim()) {
      alert('Please enter all fields');
      return;
    }

    // 🔁 Check coin balance
    const coinRef = doc(db, 'coins', sender.uid);
    const coinSnap = await getDoc(coinRef);
    const currentCoins = coinSnap.exists() ? coinSnap.data().balance : 0;

    if (currentCoins < 1) {
      alert("You don't have enough coins. Please buy more.");
      return;
    }

    // 🟡 Deduct 1 coin
    await setDoc(coinRef, { balance: currentCoins - 1 });

    // 💬 Send message anyway
    const chatId =
      sender.uid > receiverId
        ? `${sender.uid}_${receiverId}`
        : `${receiverId}_${sender.uid}`;

    await addDoc(collection(db, 'messages', chatId, 'chat'), {
      from: sender.uid,
      to: receiverId,
      text: message,
      timestamp: new Date(),
    });

    alert('Message sent successfully!');
    setMessage('');
    setReceiverId('');
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">💌 Direct Message (Without Match)</h2>
        <input
          type="text"
          placeholder="Enter Receiver's UID"
          className="w-full border p-2 rounded mb-3"
          value={receiverId}
          onChange={e => setReceiverId(e.target.value)}
        />
        <textarea
          rows={4}
          placeholder="Your message..."
          className="w-full border p-2 rounded mb-3"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button
          onClick={sendDM}
          className="w-full bg-pink-500 text-white py-2 rounded"
        >
          Send Message (Cost: 1 Coin)
        </button>
      </div>
    </div>
  );
}
