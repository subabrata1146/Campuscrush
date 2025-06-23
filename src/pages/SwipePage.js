
// src/pages/SwipePage.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SwipePage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) navigate("/login");
      else {
        setCurrentUser(user);
        const allUsers = await getDocs(collection(db, "users"));
        const userList = allUsers.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u) => u.uid !== user.uid);
        setUsers(userList);
      }
    });
  }, []);

  const handleSwipe = async (liked) => {
    if (!users[index]) return;

    const currentUserRef = doc(db, "users", currentUser.uid);
    const targetUser = users[index];

    // Add to current user's swipes
    await updateDoc(currentUserRef, {
      swipes: [...(currentUser.swipes || []), targetUser.uid],
    });

    // Optional: match logic (you can expand this)
    if (liked) {
      console.log(`You liked ${targetUser.name}`);
    }

    setIndex((prev) => prev + 1);
  };

  if (!users.length || index >= users.length) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-pink-50 text-xl">
        No more profiles to show 💔
      </div>
    );
  }

  const user = users[index];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-100">
      <motion.div
        key={user.uid}
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        className="bg-white shadow-lg p-6 rounded-xl text-center w-80"
      >
        <img
          src={user.photoURL || "https://via.placeholder.com/150"}
          alt={user.name}
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <div className="flex flex-col items-center">
  <h2 className="text-xl font-bold flex items-center gap-2">
    {user.name}{user.premium &&  ( <span className="text-xs bg-yellow-300 px-2 py-1 rounded-full">Premium</span>
    )}
  </h2>
  <p className="text-sm text-gray-600">{user.email}</p>
</div>

        <div className="mt-6 flex justify-around">
          <button
            onClick={() => handleSwipe(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg"
          >
            Pass
          </button>
          <button
            onClick={() => handleSwipe(true)}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg"
          >
            Like ❤️
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SwipePage;
