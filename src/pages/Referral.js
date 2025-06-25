import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/firebaseConfig';

export default function ReferralPage() {
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const link = `${window.location.origin}/register?ref=${user.uid}`;
      setReferralLink(link);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-6">
      <h2 className="text-2xl font-bold mb-4">🎯 Invite Friends</h2>
      <p className="mb-2 text-center">Share your referral link with friends:</p>
      <input
        className="border p-2 rounded w-full max-w-md mb-4 text-center"
        readOnly
        value={referralLink}
      />
      <button
        onClick={() => navigator.clipboard.writeText(referralLink)}
        className="bg-pink-500 text-white px-4 py-2 rounded"
      >
        Copy Link
      </button>
    </div>
  );
}
