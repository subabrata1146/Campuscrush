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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SwipePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
  
  <Route path="/coin-shop" element={<CoinShop />} />
  <Route path="/buy-premium" element={<BuyPremium />} />
</Routes>
      </Routes>
    </Router>
  );
}

export default App;

