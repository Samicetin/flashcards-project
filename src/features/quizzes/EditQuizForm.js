import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ROUTES from "../../app/routes";
import { selectCards, addCard, updateCard, removeCard } from "../cards/cardsSlice";
import { updateQuizCardIds } from "./quizzesSlice";
import { saveCardToFirestore, deleteCardFromFirestore } from "../cards/firestoreCards";
import { saveQuizToFirestore } from "./firestoreQuizzes";

export default function EditQuizForm({ quiz, onCancel }) {
  const cardsState = useSelector(selectCards);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Initialize cards with existing quiz cards
  const initialCards = quiz.cardIds.map((cardId) => ({
    id: cardId,
    front: cardsState[cardId]?.front || "",
    back: cardsState[cardId]?.back || "",
    isNew: false
  }));

  const [cards, setCards] = useState(initialCards);

  const handleAddCard = (e) => {
    e.preventDefault();
    setCards(cards.concat({ id: null, front: "", back: "", isNew: true }));
  };

  const handleRemoveCard = async (e, index) => {
    e.preventDefault();
    const cardToRemove = cards[index];
    
    // Only dispatch removeCard if it's an existing card (not new)
    if (!cardToRemove.isNew && cardToRemove.id) {
      dispatch(removeCard({ id: cardToRemove.id }));
      await deleteCardFromFirestore(cardToRemove.id);
    }
    
    setCards(cards.filter((card, i) => index !== i));
  };

  const updateCardState = (index, side, value) => {
    const newCards = cards.slice();
    newCards[index][side] = value;
    setCards(newCards);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cardIds = [];

    // Process all cards
    for (const card of cards) {
      if (card.front.trim().length === 0 || card.back.trim().length === 0) {
        continue; // Skip empty cards
      }

      if (card.isNew) {
        // Add new cards
        const cardId = uuidv4();
        cardIds.push(cardId);
        const newCard = { id: cardId, front: card.front, back: card.back };
        dispatch(addCard(newCard));
        await saveCardToFirestore(newCard);
      } else {
        // Update existing cards
        cardIds.push(card.id);
        const updatedCard = { id: card.id, front: card.front, back: card.back };
        dispatch(updateCard(updatedCard));
        await saveCardToFirestore(updatedCard);
      }
    }

    // Update quiz with new cardIds
    dispatch(updateQuizCardIds({ id: quiz.id, cardIds }));
    await saveQuizToFirestore({ ...quiz, cardIds });

    navigate(ROUTES.quizzesRoute());
  };

  return (
    <section>
      <h1>Edit Quiz: {quiz.name}</h1>
      <form onSubmit={handleSubmit}>
        {cards.map((card, index) => (
          <div key={index} className="card-front-back">
            <input
              id={`card-front-${index}`}
              value={cards[index].front}
              onChange={(e) =>
                updateCardState(index, "front", e.currentTarget.value)
              }
              placeholder="Question"
            />

            <input
              id={`card-back-${index}`}
              value={cards[index].back}
              onChange={(e) =>
                updateCardState(index, "back", e.currentTarget.value)
              }
              placeholder="Answer"
            />

            <button
              onClick={(e) => handleRemoveCard(e, index)}
              className="remove-card-button"
            >
              Remove Card
            </button>
          </div>
        ))}

        <button onClick={handleAddCard} className="button">
          Add Card
        </button>

        <div className="form-actions">
          <button type="submit" className="button button-primary">
            Save Changes
          </button>
          <button onClick={onCancel} className="button button-secondary">
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
