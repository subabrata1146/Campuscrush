// pages/BuyPremium.js
import React from "react";

const BuyPremium = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Upgrade to Premium 🌟</h1>
        <p className="mb-4">Get direct messages, instant matches, and more!</p>
        <p className="mb-2 font-bold">Cost: ₹299 for 30 days</p>
        <p className="text-sm mb-6 text-gray-600">Pay via UPI to:</p>
        <p className="font-mono bg-gray-100 p-2 rounded">msubabrata@okaxis</p>
        <p className="text-xs text-gray-500 mt-4">
          After payment, send a screenshot and your UID/email to @msubabrata@gmail.com
        </p>
      </div>
    </div>
  );
};

export default BuyPremium;
