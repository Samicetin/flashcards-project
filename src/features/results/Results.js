import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../app/routes";
import { selectAttempts } from "./resultsSlice";
import { selectQuizzes } from "../quizzes/quizzesSlice";
import Leaderboard from "./Leaderboard";

export default function Results() {
  const attempts = useSelector(selectAttempts);
  const quizzes = useSelector(selectQuizzes);
  const navigate = useNavigate();

  const attemptedIds = useMemo(
    () => Object.keys(attempts).filter((quizId) => quizzes[quizId]),
    [attempts, quizzes]
  );
  const [activeQuizId, setActiveQuizId] = useState("");

  const selectedQuizId = activeQuizId || attemptedIds[0] || "";
  const selectedAttempt = attempts[selectedQuizId];
  const selectedQuiz = quizzes[selectedQuizId];

  if (attemptedIds.length === 0) {
    return (
      <section>
        <h1>Results</h1>
        <p>Play a quiz first to unlock the results page.</p>
        <button className="button" onClick={() => navigate(ROUTES.quizzesRoute())}>
          Go to Quizzes
        </button>
      </section>
    );
  }

  return (
    <section>
      <h1>Results</h1>
      <p>You have attempted {attemptedIds.length} quiz{attemptedIds.length > 1 ? "es" : ""}.</p>

      <div className="results-tabs" style={{ display: "flex", flexWrap: "wrap", gap: "10px", margin: "16px 0 20px" }}>
        {attemptedIds.map((quizId) => (
          <button
            key={quizId}
            className="button"
            style={{
              background: selectedQuizId === quizId ? "#03a8d8" : "#fff",
              color: selectedQuizId === quizId ? "#fff" : "#03a8d8",
            }}
            onClick={() => setActiveQuizId(quizId)}
          >
            {quizzes[quizId]?.name || quizId}
          </button>
        ))}
      </div>

      {selectedAttempt && selectedQuiz && (
        <div className="result-item" style={{ marginBottom: "20px" }}>
          <h3>{selectedQuiz.name}</h3>
          <p>
            {selectedAttempt.score} / {selectedAttempt.total} (
            {Math.round((selectedAttempt.score / selectedAttempt.total) * 100)}%)
          </p>
          <p>{selectedAttempt.win ? "Won ✅" : "Not yet won ❌"}</p>
          <p>Last attempt: {new Date(selectedAttempt.lastAttempt).toLocaleString()}</p>
        </div>
      )}

      <Leaderboard quizId={selectedQuizId} />
    </section>
  );
}
