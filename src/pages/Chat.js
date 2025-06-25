// src/pages/Chat.js
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';

export default function Chat() {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchMatches = async () => {
      const likesRef = collection(db, 'likes');
      const q = query(likesRef, where('from', '==', currentUser.uid));

      const unsub = onSnapshot(q, async snapshot => {
        const matchUids = [];

        const promises = snapshot.docs.map(doc1 => {
          const toUser = doc1.data().to;
          const reverseQ = query(
            likesRef,
            where('from', '==', toUser),
            where('to', '==', currentUser.uid)
          );

          return new Promise(resolve => {
            onSnapshot(reverseQ, reverseSnap => {
              reverseSnap.forEach(doc2 => {
                if (doc2.exists()) {
                  matchUids.push(toUser);
                }
              });
              resolve();
            });
          });
        });

        await Promise.all(promises);
        setMatchedUsers([...new Set(matchUids)]);
      });

      return () => unsub();
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    if (!selectedChat) return;

    const chatId =
      currentUser.uid > selectedChat
        ? `${currentUser.uid}_${selectedChat}`
        : `${selectedChat}_${currentUser.uid}`;

    const q = query(
      collection(db, 'messages', chatId, 'chat'),
      orderBy('timestamp')
    );

    const unsub = onSnapshot(q, snapshot => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setMessages(msgs);
    });

    return () => unsub();
  }, [selectedChat]);

  const checkAccess = async (chatId) => {
    const isMatched = matchedUsers.includes(selectedChat);
    if (isMatched) return true;

    const accessDoc = await getDoc(doc(db, 'directAccess', chatId));
    return accessDoc.exists() && accessDoc.data().allowed;
  };

  const sendMessage = async () => {
    if (!msgInput.trim() || !selectedChat) return;

    const chatId =
      currentUser.uid > selectedChat
        ? `${currentUser.uid}_${selectedChat}`
        : `${selectedChat}_${currentUser.uid}`;

    const messageAllowed = await checkAccess(chatId);

    if (!messageAllowed) {
      const confirmUseCoin = window.confirm(
        "You're not matched. Use 1 coin to send a direct message?"
      );

      if (!confirmUseCoin) return;

      // Check coin balance
      const coinRef = doc(db, 'coins', currentUser.uid);
      const coinSnap = await getDoc(coinRef);

      if (!coinSnap.exists() || coinSnap.data().balance < 1) {
        alert("Not enough coins!");
        return;
      }

      // Deduct 1 coin
      await updateDoc(coinRef, {
        balance: increment(-1),
      });

      // Allow future access
      await setDoc(doc(db, 'directAccess', chatId), { allowed: true });
    }

    // Send the message
    await addDoc(collection(db, 'messages', chatId, 'chat'), {
      from: currentUser.uid,
      to: selectedChat,
      text: msgInput,
      timestamp: new Date(),
    });

    setMsgInput('');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/3 p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Matches</h2>
        {matchedUsers.map(uid => (
          <div
            key={uid}
            onClick={() => setSelectedChat(uid)}
            className={`p-2 cursor-pointer hover:bg-pink-100 ${
              selectedChat === uid ? 'bg-pink-200' : ''
            }`}
          >
            {uid}
          </div>
        ))}
      </div>

      <div className="w-full md:w-2/3 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto border rounded p-2 mb-4 bg-white">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 my-1 rounded ${
                msg.from === currentUser.uid
                  ? 'text-right bg-pink-100'
                  : 'text-left bg-gray-100'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {selectedChat && (
          <div className="flex">
            <input
              className="flex-1 p-2 border rounded-l"
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              placeholder="Type a message"
            />
            <button
              onClick={sendMessage}
              className="bg-pink-500 text-white px-4 rounded-r"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
