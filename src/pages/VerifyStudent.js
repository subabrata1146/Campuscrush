import React, { useState } from 'react';
import { auth, storage, db } from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function VerifyStudent() {
  const [idCard, setIdCard] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user || !idCard || !selfie) {
      alert("All fields required.");
      return;
    }

    try {
      const idRef = ref(storage, `verifications/${user.uid}_idCard`);
      const selfieRef = ref(storage, `verifications/${user.uid}_selfie`);

      await uploadBytes(idRef, idCard);
      await uploadBytes(selfieRef, selfie);

      const idCardURL = await getDownloadURL(idRef);
      const selfieURL = await getDownloadURL(selfieRef);

      await setDoc(doc(db, 'verifications', user.uid), {
        uid: user.uid,
        idCardURL,
        selfieURL,
        status: 'pending',
        timestamp: new Date()
      });

      alert("Submitted for verification. You'll be notified after approval.");
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Failed to upload.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h2 className="text-2xl font-semibold mb-4">Student Verification</h2>
      <p className="text-sm text-gray-500 mb-4">Upload your Student ID card and a clear selfie</p>

      <input type="file" accept="image/*" onChange={e => setIdCard(e.target.files[0])} className="mb-3" />
      <input type="file" accept="image/*" onChange={e => setSelfie(e.target.files[0])} className="mb-4" />

      <button
        onClick={handleSubmit}
        className="bg-pink-500 text-white px-4 py-2 rounded"
      >
        Submit for Verification
      </button>
    </div>
  );
}
