import React, { useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Get referral code from URL
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');

      // ✅ Save referral if it exists and isn't self-referral
      if (ref && ref !== user.uid) {
        await setDoc(doc(db, 'referralStatus', user.uid), {
          referrer: ref,
          isPaid: false
        });

        await updateDoc(doc(db, 'referrals', ref), {
          referred: arrayUnion(user.uid)
        });
      }

      alert("Registered successfully");
      navigate('/profile'); // after registration go to profile setup
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Register</h2>
      <input
        className="mb-2 p-2 border"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="mb-2 p-2 border"
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleRegister}
      >
        Sign Up
      </button>
    </div>
  );
}
