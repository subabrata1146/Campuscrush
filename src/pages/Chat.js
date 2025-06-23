// src/pages/Chat.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const Chat = () => {
  const [currentUserData, setCurrentUserData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      setCurrentUserData({ ...snap.data(), uid: user.uid });
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!currentUserData) return;

      const allUsersSnap = await getDocs(collection(db, "users"));
      const matchedUsers = [];
      allUsersSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (
          data.swipes?.includes(currentUserData.uid) &&
          currentUserData.swipes?.includes(data.uid)
        ) {
          matchedUsers.push(data);
        }
      });
      setMatches(matchedUsers);
    };

    fetchMatches();
  }, [currentUserData]);

  const openChat = async (matchUser) => {
    setSelectedMatch(matchUser);
    const roomId =
      currentUserData.uid > matchUser.uid
        ? `${currentUserData.uid}_${matchUser.uid}`
        : `${matchUser.uid}_${currentUserData.uid}`;

    const msgQuery = query(
      collection(db, "messages", roomId, "chat"),
      orderBy("timestamp")
    );

    onSnapshot(msgQuery, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });
  };

  const sendMessage = async () => {
    if (!msgInput || !selectedMatch) return;

    const roomId =
      currentUserData.uid > selectedMatch.uid
        ? `${currentUserData.uid}_${selectedMatch.uid}`
        : `${selectedMatch.uid}_${currentUserData.uid}`;

    await addDoc(collection(db, "messages", roomId, "chat"), {
      sender: currentUserData.uid,
      receiver: selectedMatch.uid,
      text: msgInput,
      timestamp: new Date(),
    });

    setMsgInput("");
  };

  return (
    <div className="flex h-screen bg-pink-50">
      <div className="w-1/3 bg-white p-4 border-r overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">Your Matches</h3>
        {matches.map((match) => (
          <div
            key={match.uid}
            className="p-2 hover:bg-pink-100 cursor-pointer rounded"
            onClick={() => openChat(match)}
          >
            {match.name}
          </div>
        ))}
      </div>

      <div className="w-2/3 p-4 flex flex-col">
        {selectedMatch ? (
          <>
            <h2 className="text-xl font-bold mb-2 border-b pb-2">
              Chatting with {selectedMatch.name}
            </h2>
            <div className="flex-1 overflow-y-auto mb-4 border p-2 rounded bg-white">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 p-2 rounded ${
                    msg.sender === currentUserData.uid
                      ? "bg-pink-200 text-right"
                      : "bg-gray-200 text-left"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border p-2 rounded-l"
              />
              <button
                onClick={sendMessage}
                className="bg-pink-500 text-white px-4 rounded-r"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 my-auto">Select a match to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
