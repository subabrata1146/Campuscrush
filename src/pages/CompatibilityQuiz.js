import React, { useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    q: "What's your ideal date?",
    options: ["Movie night", "Long walk", "Party", "Study session"]
  },
  {
    q: "Which pet do you prefer?",
    options: ["Dog", "Cat", "Rabbit", "No pets"]
  },
  {
    q: "What’s your favorite weekend activity?",
    options: ["Gaming", "Outing", "Reading", "Sleeping"]
  },
  {
    q: "Are you a morning or night person?",
    options: ["Morning", "Night", "Both", "None"]
  },
  {
    q: "How social are you?",
    options: ["Very", "Little", "Depends", "Not at all"]
  }
];

export default function CompatibilityQuiz() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const navigate = useNavigate();

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

 const handleSubmit = async () => {
  const user = auth.currentUser;
  if (!user) return alert("Please login first");

  if (answers.includes("")) return alert("Answer all questions");

  const userRef = doc(db, 'users', user.uid);
  const quizRef = doc(db, 'quizAnswers', user.uid);

  try {
    // Save quiz answers
    await setDoc(quizRef, {
      uid: user.uid,
      answers,
      timestamp: new Date()
    });

    // Update user's Firestore profile with quiz completion
    await setDoc(userRef, { hasCompletedQuiz: true }, { merge: true });

    alert("Quiz submitted successfully!");
    navigate('/swipe');
  } catch (error) {
    console.error("Error submitting quiz: ", error);
    alert("Failed to submit quiz. Please try again.");
  }
};
  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold text-center mb-6">💡 Compatibility Quiz</h2>
      {questions.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="font-semibold">{i + 1}. {q.q}</p>
          {q.options.map(opt => (
            <label key={opt} className="block">
              <input
                type="radio"
                name={`q${i}`}
                value={opt}
                checked={answers[i] === opt}
                onChange={() => handleAnswerChange(i, opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded w-full"
      >
        Submit Quiz
      </button>
    </div>
  );
}
