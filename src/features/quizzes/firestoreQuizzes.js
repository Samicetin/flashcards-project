import { db } from "../../utils/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

export async function saveQuizToFirestore(quiz) {
  // Use quiz.id as document ID for consistency
  const quizRef = doc(db, "quizzes", quiz.id);
  await setDoc(quizRef, quiz);
}

export async function getAllQuizzesFromFirestore() {
  const snapshot = await getDocs(collection(db, "quizzes"));
  const quizzes = {};
  snapshot.forEach(doc => {
    quizzes[doc.id] = doc.data();
  });
  return quizzes;
}

export async function deleteQuizFromFirestore(quizId) {
  await deleteDoc(doc(db, "quizzes", quizId));
}

export async function getQuizFromFirestore(quizId) {
  const snapshot = await getDoc(doc(db, "quizzes", quizId));
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data();
}
