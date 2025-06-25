import React, { useState } from 'react';
import { auth, storage, db } from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function VerificationUpload() {
  const [idCard, setIdCard] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!idCard || !selfie) {
      alert("Please upload both ID card and selfie.");
      return;
    }

    try {
      setUploading(true);
      const user = auth.currentUser;
      if (!user) return;

      const idRef = ref(storage, `verifications/${user.uid}_id`);
      const selfieRef = ref(storage, `verifications/${user.uid}_selfie`);

      await uploadBytes(idRef, idCard);
      await uploadBytes(selfieRef, selfie);

      const idUrl = await getDownloadURL(idRef);
      const selfieUrl = await getDownloadURL(selfieRef);

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        verification: {
          idUrl,
          selfieUrl,
          verified: false,
          submittedAt: new Date(),
        }
      });

      alert("Verification submitted! Please wait for approval.");
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Error uploading. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h2 className="text-xl font-bold mb-4">🪪 Student Verification</h2>
      <input
        type="file"
        accept="image/*,application/pdf"
        className="mb-3"
        onChange={(e) => setIdCard(e.target.files[0])}
      />
      <label className="text-sm text-gray-600 mb-3">Upload your Student ID</label>

      <input
        type="file"
        accept="image/*"
        className="mb-3"
        onChange={(e) => setSelfie(e.target.files[0])}
      />
      <label className="text-sm text-gray-600 mb-3">Upload your Selfie</label>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-pink-500 text-white px-6 py-2 rounded mt-4 hover:bg-pink-600"
      >
        {uploading ? 'Uploading...' : 'Submit Verification'}
      </button>
    </div>
  );
}
