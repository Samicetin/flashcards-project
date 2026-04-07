import { db } from "../../utils/firebase";
import { collection, doc, getDocs, limit, orderBy, query, setDoc, where } from "firebase/firestore";

// Save or update a user's score for a quiz.
export async function saveUserScore({ userId, quizId, score, total, username, email }) {
  if (!userId || !quizId) return;

  const userScoreRef = doc(db, "userScores", `${userId}_${quizId}`);
  await setDoc(
    userScoreRef,
    {
      userId,
      quizId,
      score,
      total,
      username: username || null,
      email: email || null,
      updated: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function getLeaderboard(quizId) {
  if (!quizId) return [];

  const q = query(
    collection(db, "userScores"),
    where("quizId", "==", quizId),
    orderBy("score", "desc"),
    limit(50)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => item.data());
}
