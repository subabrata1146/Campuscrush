// src/pages/CompatibilityQuiz.js
import React, { useState } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    q: "Do you prefer night or morning?",
    options: ["Night", "Morning"],
  },
  {
    q: "What would you rather do on a date?",
    options: ["Movie", "Adventure", "Food", "Chill"],
  },
  {
    q: "Pet lover?",
    options: ["Yes", "No"],
  },
  {
    q: "Introvert or Extrovert?",
    options: ["Introvert", "Extrovert", "Mix"],
  },
  {
    q: "Do you believe in love at first sight?",
    options: ["Yes", "No", "Maybe"],
  },
];

export default function CompatibilityQuiz() {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleAnswer = (index, option) => {
    setAnswers(prev => ({ ...prev, [index]: option }));
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in");
      return;
    }

    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions.");
      return;
    }

    try {
      await setDoc(doc(db, 'quizAnswers', user.uid), {
        uid: user.uid,
        answers,
        timestamp: new Date(),
      });

      alert("Quiz submitted! Compatibility saved.");
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Failed to submit quiz.");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-pink-50">
      <h1 className="text-2xl font-bold text-center mb-6">Compatibility Quiz</h1>
      <div className="max-w-xl mx-auto bg-white shadow-md rounded p-6 space-y-4">
        {questions.map((q, index) => (
          <div key={index}>
            <p className="font-semibold">{q.q}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {q.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(index, opt)}
                  className={`px-3 py-1 rounded ${
                    answers[index] === opt
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="w-full bg-pink-600 text-white py-2 rounded mt-4"
        >
          Submit Answers
        </button>
      </div>
    </div>
  );
}
