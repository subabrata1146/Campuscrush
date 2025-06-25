// src/pages/SwipePage.js
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  increment,
  updateDoc,
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function SwipePage() {
  const [profiles, setProfiles] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const currentUserDoc = await getDoc(doc(db, 'users', user.uid));
      const data = currentUserDoc.data();
      setCurrentUserData(data);

     if (!currentUserData?.verification?.verified) {
      alert("Please complete ID and selfie verification to use swipe features.");
      navigate('/verify');
      return;
    }

      const lookingFor = data?.lookingFor || 'Any';
      const seen = data?.seenUsers || [];

      const snapshot = await getDocs(collection(db, 'users'));
      const filtered = await Promise.all(
        snapshot.docs
          .map(doc => doc.data())
          .filter(
            p =>
              p.uid !== user.uid &&
              !seen.includes(p.uid) &&
              (lookingFor === 'Any' || p.gender === lookingFor)
          )
          .map(async profile => {
            const theirQuiz = await getDoc(doc(db, 'quizAnswers', profile.uid));
            const yourQuiz = await getDoc(doc(db, 'quizAnswers', user.uid));

            let score = 0;
            if (theirQuiz.exists() && yourQuiz.exists()) {
              const yourAnswers = yourQuiz.data().answers;
              const theirAnswers = theirQuiz.data().answers;
              const total = yourAnswers.length;
              const match = yourAnswers.filter((ans, idx) => ans === theirAnswers[idx]).length;
              score = Math.round((match / total) * 100);
            }

            return { ...profile, compatibility: score };
          })
      );

      setProfiles(filtered);
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  const handleSwipe = async (liked) => {
    const user = auth.currentUser;
    const likedUser = profiles[current];

    if (liked) {
      await setDoc(doc(db, 'likes', `${user.uid}_${likedUser.uid}`), {
        from: user.uid,
        to: likedUser.uid,
        timestamp: new Date(),
      });

      const reverseDoc = await getDoc(doc(db, 'likes', `${likedUser.uid}_${user.uid}`));
      if (reverseDoc.exists()) {
        alert(`🎉 It's a match with ${likedUser.name}!`);
      }
    }

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      seenUsers: incrementArray(likedUser.uid),
    });

    setCurrent(prev => prev + 1);
  };

  const incrementArray = (uid) => {
    return {
      seenUsers: (prev) => (Array.isArray(prev) ? [...new Set([...prev, uid])] : [uid]),
    };
  };

  const profile = profiles[current];

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl">No more profiles for now 😅</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-50">
      <motion.div
        className="bg-white shadow-xl rounded-xl p-4 w-80 text-center"
        key={profile.uid}
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        exit={{ x: -100 }}
      >
        <img
          src={profile.photoURL}
          alt="profile"
          className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold">{profile.name}</h2>
        <p className="text-sm text-gray-500">{profile.gender}</p>
        <p className="text-sm text-purple-600 mt-1">💖 Compatibility: {profile.compatibility || 0}%</p>
        {currentUserData?.isPremium && (
          <p className="text-xs mt-1 text-yellow-600">🌟 Premium User</p>
        )}
      </motion.div>

      <div className="flex gap-6 mt-6">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-full"
          onClick={() => handleSwipe(false)}
        >
          ❌ Skip
        </button>
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full"
          onClick={() => handleSwipe(true)}
        >
          ❤️ Like
        </button>
      </div>
    </div>
  );
}
