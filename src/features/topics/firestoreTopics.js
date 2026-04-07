import { db } from "../../utils/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

export async function saveTopicToFirestore(topic) {
  // Use topic.id as document ID for consistency
  const topicRef = doc(db, "topics", topic.id);
  await setDoc(topicRef, topic);
}

export async function getAllTopicsFromFirestore() {
  const snapshot = await getDocs(collection(db, "topics"));
  const topics = {};
  snapshot.forEach(doc => {
    topics[doc.id] = doc.data();
  });
  return topics;
}

export async function deleteTopicFromFirestore(topicId) {
  await deleteDoc(doc(db, "topics", topicId));
}
