import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { checkPremiumStatus } from '../utils/checkPremium';

export default function Profile() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPremium = async () => {
      const user = auth.currentUser;
      if (user) {
        const premium = await checkPremiumStatus(user.uid);
        setIsPremium(premium);
      }
    };
    fetchPremium();
  }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_unsigned_preset"); // 🔁 replace with your unsigned preset

    const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!name || !gender || !lookingFor || !photo) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("User not logged in.");
        return;
      }

      setUploadProgress(0);

      const imageURL = await uploadToCloudinary(photo);
      setUploadProgress(100);

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        gender,
        lookingFor,
        photoURL: imageURL,
        email: user.email,
        createdAt: new Date()
      });

      alert("Profile saved successfully!");
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Error saving profile or uploading image.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-1">Complete Your Profile</h2>

      {isPremium && (
        <div className="text-yellow-500 font-bold mt-1">💎 Premium Member</div>
      )}

      <input
        className="p-2 mb-3 w-full max-w-sm border rounded"
        type="text"
        placeholder="Your Name"
        onChange={e => setName(e.target.value)}
      />

      <select
        className="p-2 mb-3 w-full max-w-sm border rounded"
        onChange={e => setGender(e.target.value)}
        value={gender}
      >
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <select
        className="p-2 mb-3 w-full max-w-sm border rounded"
        onChange={e => setLookingFor(e.target.value)}
        value={lookingFor}
      >
        <option value="">Looking For</option>
        <option>Male</option>
        <option>Female</option>
        <option>Any</option>
      </select>

      <input
        className="p-2 mb-3 w-full max-w-sm border rounded"
        type="file"
        accept="image/*"
        onChange={e => setPhoto(e.target.files[0])}
      />

      {uploadProgress !== null && (
        <div className="mb-3 text-sm text-gray-600">
          Uploading photo: {uploadProgress}%
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
      >
        Save Profile
      </button>
    </div>
  );
}
