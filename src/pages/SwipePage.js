import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function Swipe() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        navigate('/login'); // Not logged in
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  // Fetch user profile and matches once user is set
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        navigate('/profile'); // User hasn't completed profile
        return;
      }

      const data = userSnap.data();

      // Redirect to verify page if not verified
      if (!data.verified) {
        navigate('/verify');
        return;
      }

      setUserData(data);

      // Load potential matches
      const allUsersSnapshot = await getDocs(collection(db, 'users'));
      const allUsers = allUsersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(
          other =>
            other.id !== user.uid && // not self
            other.gender === data.preference && // matches preference
            other.preference === data.gender // reciprocal preference
        );

      setPotentialMatches(allUsers);
      setIsLoading(false);
    };

    fetchUserData();
  }, [user, navigate]);

  const handleSwipe = (direction) => {
    if (direction === 'like') {
      console.log('Liked', potentialMatches[currentIndex]?.name);
    } else {
      console.log('Skipped', potentialMatches[currentIndex]?.name);
    }

    setCurrentIndex(prev => prev + 1);
  };

  if (isLoading) return <p>Loading...</p>;

  if (currentIndex >= potentialMatches.length) {
    return <p>No more matches to show. Check back later!</p>;
  }

  const currentMatch = potentialMatches[currentIndex];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Swipe Your Match ❤️</h2>

      <div className="bg-white shadow rounded p-4 text-center">
        <img
          src={currentMatch.photoURL}
          alt="User"
          className="w-48 h-48 object-cover mx-auto rounded-full mb-4"
        />
        <h3 className="text-lg font-semibold">{currentMatch.name}</h3>
        <p className="text-gray-600">{currentMatch.bio}</p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => handleSwipe('dislike')}
            className="bg-red-500 text-white px-6 py-2 rounded"
          >
            ❌ Skip
          </button>
          <button
            onClick={() => handleSwipe('like')}
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            💚 Like
          </button>
        </div>
      </div>
    </div>
  );
}
