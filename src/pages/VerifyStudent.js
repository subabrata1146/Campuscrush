import React, { useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function VerifyStudent() {
  const [idCard, setIdCard] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Cloudinary details
  const CLOUD_NAME = 'dx4knny3g';
  const UPLOAD_PRESET = 'campuscrush_unsigned';

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    const user = auth.currentUser ;

    if (!user || !idCard || !selfie) {
      alert("Please upload both ID card and selfie.");
      return;
    }

    try {
      setUploading(true);

      const idCardURL = await uploadToCloudinary(idCard);
      const selfieURL = await uploadToCloudinary(selfie);

      await setDoc(doc(db, 'verifications', user.uid), {
        uid: user.uid,
        idCardURL,
        selfieURL,
        status: 'pending',
        submittedAt: serverTimestamp()
      });

      alert("Verification submitted successfully. Await admin approval.");
      navigate('/');
    } catch (err) {
      console.error('Upload Error:', err);
      alert("Failed to upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h2 className="text-2xl font-semibold mb-2">Student Verification</h2>
      <p className="text-sm text-gray-500 mb-4">Upload your student ID and a selfie for admin review</p>

      <div className="w-full max-w-xs">
        <label className="block text-sm font-medium text-gray-600 mb-1">Student ID Card</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setIdCard(e.target.files[0])}
          className="mb-4 block w-full"
        />

        <label className="block text-sm font-medium text-gray-600 mb-1">Selfie</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setSelfie(e.target.files[0])}
          className="mb-6 block w-full"
        />

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className={`w-full px-4 py-2 text-white rounded ${uploading ? 'bg-gray-400' : 'bg-pink-500 hover:bg-pink-600'}`}
        >
          {uploading ? 'Submitting...' : 'Submit for Verification'}
        </button>
      </div>
    </div>
  );
}
