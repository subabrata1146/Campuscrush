// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [idDoc, setIdDoc] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      setUserData(snap.data());
    }
  };

  const uploadImage = async (file, path) => {
    const storageRef = ref(storage, `${path}/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleUpdate = async () => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    let updates = {};
    if (photo) {
      const photoURL = await uploadImage(photo, "profilePhotos");
      updates.photoURL = photoURL;
    }
    if (idDoc) {
      const idURL = await uploadImage(idDoc, "ids");
      updates.idVerification = idURL;
    }

    await updateDoc(userRef, updates);
    alert("Profile updated!");
    fetchUserData();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Your Profile</h2>
  {userData?.premium ? (
  <p className="text-green-600 font-semibold text-center mb-4">
    ✅ You are a Premium Member
  </p>
) : (
  <p className="text-red-500 font-semibold text-center mb-4">
    ❌ You are not a Premium Member
  </p>
)}

        {userData?.photoURL && (
          <img
            src={userData.photoURL}
            alt="Profile"
            className="w-28 h-28 mx-auto rounded-full mb-4"
          />
        )}
<p className="text-sm mt-4 text-center">
  Share this referral code with friends: <br />
  <span className="font-mono text-pink-600">{auth.currentUser.uid}</span>
</p>

        <label className="block mb-2">Upload Profile Photo:</label>
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="mb-4" />

        <label className="block mb-2">Upload Student ID:</label>
        <input type="file" onChange={(e) => setIdDoc(e.target.files[0])} className="mb-4" />

        <button
          onClick={handleUpdate}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 w-full"
        >
          Update Profile
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-500 text-sm underline"
        >
          Back to Swiping
        </button>
      </div>
    </div>
  );
};

export default Profile;
