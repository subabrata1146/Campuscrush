import React, { useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registered successfully");
      navigate('/profile'); // after registration go to profile setup
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Register</h2>
      <input className="mb-2 p-2 border" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="mb-2 p-2 border" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleRegister}>Sign Up</button>
    </div>
  );
}
