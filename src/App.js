// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SwipePage from "./pages/SwipePage";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import CoinShop from "./pages/CoinShop";
import BuyPremium from "./pages/BuyPremium";
import CompatibilityQuiz from "./pages/CompatibilityQuiz";
import VerificationUpload from './pages/VerificationUpload';
import DirectMessage from './pages/DirectMessage';
import ReferralPage from './pages/ReferralPage';
import VerifyStudent from './pages/VerifyStudent';
import AdminPanel from './pages/AdminPanel';







function App() {
  return (
    <Router>
      <Routes>
        <Route path="/SwipePage" element={<SwipePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
  <Route path="/compatibility-quiz" element={<CompatibilityQuiz />} />
  <Route path="/buy-premium" element={<BuyPremium />} />
  <Route path="/coin-shop" element={<CoinShop />} />
  <Route path="/direct-message" element={<DirectMessage />} />
  <Route path="/referral" element={<ReferralPage />} />
  <Route path="/verify" element={<VerifyStudent />} />
  <Route path="/verify" element={<VerificationUpload />} />
  <Route path="/admin" element={<AdminPanel />} />
  </Routes>
    </Router>
  );
}

export default App;

