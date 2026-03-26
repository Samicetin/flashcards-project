import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export default function Leaderboard({ quizId }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      const q = query(
        collection(db, "userScores"),
        where("quizId", "==", quizId),
        orderBy("score", "desc"),
        orderBy("updated", "asc"),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setScores(data);
      setLoading(false);
    }
    if (quizId) fetchLeaderboard();
  }, [quizId]);

  if (loading) return <div>Loading leaderboard...</div>;
  if (!scores.length) return <div>No scores yet for this quiz.</div>;

  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      <ol>
        {scores.map((entry, i) => (
          <li key={entry.userId}>
            <strong>{entry.username || entry.userId}</strong>: {entry.score} / {entry.total}
          </li>
        ))}
      </ol>
    </div>
  );
}
