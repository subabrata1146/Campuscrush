// src/pages/Register.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        name,
        uid: userCred.user.uid,
        coins: 0,
        isVerified: false,
        premium: false,
        photoURL: "",
        swipes: [],
        matches: []
      });
      if (referralCode) {
  await updateReferral(referralCode, userCred.user.uid);
      }
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50">
      <h2 className="text-3xl font-bold mb-6">CampusCrush Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col w-80 bg-white p-6 rounded-xl shadow-md">
        <input
          type="text"
          placeholder="Name"
          className="mb-4 p-2 border rounded"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="mb-4 p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600">
          Register
        </button>
            <input type="text"
  placeholder="Referral code (optional)" className="mb-4 p-2 border rounded"onChange={(e) => setReferralCode(e.target.value)}/>
        <p
          onClick={() => navigate("/login")}
          className="text-sm text-blue-500 mt-4 cursor-pointer"
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
};

export default Register;
