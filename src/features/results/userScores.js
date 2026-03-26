import { db } from "../../utils/firebase";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";

// Save or update user score for a quiz
export async function saveUserScore({ userId, quizId, score, total }) {
  if (!userId) return;
  const userScoreRef = doc(db, "userScores", `${userId}_${quizId}`);
  await setDoc(userScoreRef, { userId, quizId, score, total, updated: new Date().toISOString() }, { merge: true });
}

// Get all user scores for leaderboard
export async function getLeaderboard(quizId) {
  // This is a placeholder; actual implementation should use Firestore queries
  // to fetch and sort top scores for the quizId
  // Example: query(collection(db, "userScores"), where("quizId", "==", quizId), orderBy("score", "desc"), limit(10))
  return [];
}
