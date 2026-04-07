import { db } from "../../utils/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

export async function saveCardToFirestore(card) {
  // Use card.id as document ID for consistency
  const cardRef = doc(db, "cards", card.id);
  await setDoc(cardRef, card);
}

export async function getAllCardsFromFirestore() {
  const snapshot = await getDocs(collection(db, "cards"));
  const cards = {};
  snapshot.forEach(doc => {
    cards[doc.id] = doc.data();
  });
  return cards;
}

export async function deleteCardFromFirestore(cardId) {
  await deleteDoc(doc(db, "cards", cardId));
}
