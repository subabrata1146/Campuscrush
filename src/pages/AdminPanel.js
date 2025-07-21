import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
  getDoc
} from 'firebase/firestore';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [coins, setCoins] = useState(0);
  const [makePremium, setMakePremium] = useState(false);
  const [verificationData, setVerificationData] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const fetchVerification = async (uid) => {
    const docRef = doc(db, 'verifications', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setVerificationData({ id: uid, ...docSnap.data() });
    } else {
      setVerificationData(null);
    }
  };

  const handleUserClick = (user) => { // Fixed function 
    setSelected(user);
    fetchVerification(user.id);
    setCoins(0);
    setMakePremium(user.isPremium || false);
  };

  const updateUser  = async () => {
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

    alert("User  updated!");
    setSelected(null);
    setCoins(0);
    setMakePremium(false);
    setVerificationData(null);
  };

  const approveVerification = async () => {
    try {
      await updateDoc(doc(db, "verifications", verificationData.id), {
        status: "approved",
      });
      await updateDoc(doc(db, "users", verificationData.id), {
        verified: true,
      });
      alert("Verification Approved!");
      setVerificationData(null);
    } catch (error) {
      console.error("Error approving verification: ", error);
      alert("Failed to approve verification. Please try again.");
    }
  };

  const rejectVerification = async () => {
    try {
      await updateDoc(doc(db, "verifications", verificationData.id), {
        status: "rejected",
      });
      await updateDoc(doc(db, "users", verificationData.id), {
        verified: false,
      });
      alert("Verification Rejected!");
      setVerificationData(null);
    } catch (error) {
      console.error("Error rejecting verification: ", error);
      alert("Failed to reject verification. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🔐 Admin Panel</h2>
      <ul className="mb-4 max-h-[300px] overflow-y-auto">
        {users.map(user => (
          <li
            key={user.id}
            onClick={() => handleUserClick(user)} // Fixed function name
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
            onChange={e => setCoins(parseInt(e.target.value) || 0)}
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
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={updateUser}
          >
            ✅ Update User
          </button>

          {verificationData && (
            <div className="mt-6 border-t pt-4">
              <h4 className="text-md font-semibold mb-2">Verification</h4>
              <p>Status: <strong>{verificationData.status}</strong></p>
              <div className="flex gap-4 my-2">
                <div>
                  <p className="text-sm">ID Photo:</p>
                  <img src={verificationData.idURL} alt="ID" className="w-32 rounded border" />
                </div>
                <div>
                  <p className="text-sm">Selfie:</p>
                  <img src={verificationData.selfieURL} alt="Selfie" className="w-32 rounded border" />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={approveVerification}
                >
                  ✅ Approve
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={rejectVerification}
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}