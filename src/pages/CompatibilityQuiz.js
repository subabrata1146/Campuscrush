// src/pages/CompatibilityQuiz.js
import React, { useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    q: "Are you more of an introvert or extrovert?",
    options: ["Introvert", "Extrovert"],
  },
  {
    q: "Do you prefer night outs or cozy nights in?",
    options: ["Night outs", "Cozy nights in"],
  },
  {
    q: "What's your ideal date?",
    options: ["Dinner", "Movie", "Adventure", "Coffee"],
  },
  {
    q: "How often do you like texting your date?",
    options: ["Frequently", "Sometimes", "Rarely"],
  },
  {
    q: "Pick a vibe",
    options: ["Romantic", "Funny", "Chill", "Adventurous"],
  },
];

const CompatibilityQuiz = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const navigate = useNavigate();

  const handleChange = (qIndex, value) => {
    const newAns = [...answers];
    newAns[qIndex] = value;
    setAnswers(newAns);
  };

  const handleSubmit = async () => {
    if (answers.includes("")) return alert("Please answer all questions.");
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), {
      compatibilityAnswers: answers,
    });

    alert("✅ Quiz submitted! Your profile is now more matchable.");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">🧠 Compatibility Quiz</h2>
      <div className="w-full max-w-2xl space-y-6">
        {questions.map((q, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <p className="font-semibold mb-2">{q.q}</p>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChange(index, opt)}
                  className={`px-4 py-2 rounded ${
                    answers[index] === opt
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Submit Answers
      </button>
    </div>
  );
};

export default CompatibilityQuiz;
