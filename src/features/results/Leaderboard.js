import React, { useEffect, useState } from "react";
import { getLeaderboard } from "./userScores";

export default function Leaderboard({ quizId }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLeaderboard() {
      if (!quizId) {
        setScores([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getLeaderboard(quizId);
        // Tie-break by oldest update timestamp so first achiever stays ahead.
        const sorted = [...data].sort((a, b) => {
          if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
          const aTime = Date.parse(a.updated || "") || Number.MAX_SAFE_INTEGER;
          const bTime = Date.parse(b.updated || "") || Number.MAX_SAFE_INTEGER;
          return aTime - bTime;
        });
        setScores(sorted.slice(0, 10));
      } catch (err) {
        setError("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [quizId]);

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div>{error}</div>;
  if (!scores.length) return <div>No scores yet for this quiz.</div>;

  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      <ol>
        {scores.map((entry) => (
          <li key={entry.userId}>
            <strong>{entry.username || entry.email || entry.userId}</strong>: {entry.score} / {entry.total}
          </li>
        ))}
      </ol>
    </div>
  );
}
