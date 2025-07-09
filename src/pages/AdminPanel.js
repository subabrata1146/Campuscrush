// src/pages/AdminPanel.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [coins, setCoins] = useState(0);
  const [makePremium, setMakePremium] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const updateUser = async () => {
    if (!selected) return;

    const userRef = doc(db, 'users', selected.id);
    const coinRef = doc(db, 'coins', selected.id);

    if (coins > 0) {
      await updateDoc(coinRef, {
        balance: increment(coins),
      });
    }

    await updateDoc(userRef, {
      isPremium: makePremium,
    });

    alert("User updated!");
    setSelected(null);
    setCoins(0);
    setMakePremium(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🔐 Admin Panel</h2>
      <ul className="mb-4">
        {users.map(user => (
          <li
            key={user.id}
            onClick={() => setSelected(user)}
            className="cursor-pointer hover:bg-gray-100 p-2 border-b"
          >
            {user.name || user.email} ({user.id})
          </li>
        ))}
      </ul>

      {selected && (
        <div className="bg-white p-4 rounded shadow w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2">Manage: {selected.name || selected.email}</h3>
          <input
            className="border p-2 w-full mb-2"
            type="number"
            placeholder="Add Coins"
            value={coins}
            onChange={e => setCoins(parseInt(e.target.value))}
          />
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={makePremium}
              onChange={e => setMakePremium(e.target.checked)}
              className="mr-2"
            />
            Set as Premium
          </label>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={updateUser}
          >
            ✅ Update User
          </button>
        </div>
      )}
    </div>
  );
}
