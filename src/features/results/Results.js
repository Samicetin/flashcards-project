import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../app/routes";
import { selectAttempts } from "./resultsSlice";
import { selectQuizzes } from "../quizzes/quizzesSlice";

export default function Results() {
  const attempts = useSelector(selectAttempts);
  const quizzes = useSelector(selectQuizzes);
  const navigate = useNavigate();

  const attemptedIds = Object.keys(attempts);

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
      <ul className="results-list">
        {attemptedIds.map((quizId) => {
          const attempt = attempts[quizId];
          const quiz = quizzes[quizId];
          if (!quiz) return null;

          return (
            <li key={quizId} className="result-item">
              <h3>{quiz.name}</h3>
              <p>{attempt.score} / {attempt.total} ({Math.round((attempt.score/attempt.total)*100)}%)</p>
              <p>{attempt.win ? "Won ✅" : "Not yet won ❌"}</p>
              <p>Last attempt: {new Date(attempt.lastAttempt).toLocaleString()}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
