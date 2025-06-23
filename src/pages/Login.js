// src/pages/Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100">
      <h2 className="text-3xl font-bold mb-6">CampusCrush Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col w-80 bg-white p-6 rounded-xl shadow-md">
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
          Login
        </button>
        <p
          onClick={() => navigate("/register")}
          className="text-sm text-blue-500 mt-4 cursor-pointer"
        >
          Don't have an account? Register
        </p>
      </form>
    </div>
  );
};

export default Login;

