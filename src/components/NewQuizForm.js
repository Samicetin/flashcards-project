import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ROUTES from "../app/routes";
// import selectors
import { selectTopics, addQuizIdToTopic, addTopic } from "../features/topics/topicsSlice";
import { addQuiz } from "../features/quizzes/quizzesSlice";
import { saveQuizToFirestore } from "../features/quizzes/firestoreQuizzes";
import { addCard } from "../features/cards/cardsSlice";
import { saveCardToFirestore } from "../features/cards/firestoreCards";
import { getAllTopicsFromFirestore, saveTopicToFirestore } from "../features/topics/firestoreTopics";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function NewQuizForm() {
  const [name, setName] = useState("");
  const [cards, setCards] = useState([]);
  const [topicId, setTopicId] = useState("");
  const navigate = useNavigate();
  const topics = useSelector(selectTopics);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || Object.keys(topics).length > 0) {
        return;
      }

      try {
        const topicsFromDb = await getAllTopicsFromFirestore();
        Object.values(topicsFromDb).forEach((topic) => {
          dispatch(addTopic(topic));
        });
      } catch (error) {
        if (error?.code !== "permission-denied") {
          console.error("Failed to load topics for new quiz form:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, topics]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.length === 0 || !topicId || !topics[topicId]) {
      return;
    }

    const cardIds = [];

    // create the new cards here and add each card's id to cardIds
    for (const card of cards) {
      const cardId = uuidv4();
      cardIds.push(cardId);
      const cardObj = { id: cardId, front: card.front, back: card.back };
      dispatch(addCard(cardObj));
      await saveCardToFirestore(cardObj);
    }

    const quizId = uuidv4();
    // dispatch add quiz action
    const quizObj = { id: quizId, name, topicId, cardIds };
    dispatch(addQuiz(quizObj));
    dispatch(addQuizIdToTopic({ id: quizId, topicId }));
    await saveQuizToFirestore(quizObj);

    const nextQuizIds = [...(topics[topicId].quizIds || []), quizId];
    await saveTopicToFirestore({ ...topics[topicId], quizIds: nextQuizIds });

    navigate(ROUTES.quizRoute(quizId), { state: { editing: true } })
  };

  const addCardInputs = (e) => {
    e.preventDefault();
    setCards(cards.concat({ front: "", back: "" }));
  };

  const removeCard = (e, index) => {
    e.preventDefault();
    setCards(cards.filter((card, i) => index !== i));
  };

  const updateCardState = (index, side, value) => {
    const newCards = cards.slice();
    newCards[index][side] = value;
    setCards(newCards);
  };

  return (
    <section className="page-section">
      <header className="page-header center">
        <h1>Create a new quiz</h1>
        <p className="page-subtitle">Add quiz details, choose a topic, and build your card set.</p>
      </header>

      <form onSubmit={handleSubmit} className="modern-form">
        <input
          id="quiz-name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Quiz Title"
        />
        <select
          id="quiz-topic"
          onChange={(e) => setTopicId(e.currentTarget.value)}
          placeholder="Topic"
          required
          value={topicId}
        >
          <option value="">Topic</option>
          {Object.values(topics).map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
        <div className="new-quiz-cards">
          {cards.map((card, index) => (
            <div key={index} className="card-front-back modern-card-inputs">
              <p className="card-index">Card {index + 1}</p>
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
                onClick={(e) => removeCard(e, index)}
                className="remove-card-button"
              >
                Remove Card
              </button>
            </div>
          ))}
        </div>

        <div className="actions-container modern-actions">
          <button onClick={addCardInputs}>Add a Card</button>
          <button type="submit">Create Quiz</button>
        </div>

        {cards.length === 0 && (
          <p className="form-help-text">Start by adding at least one card.</p>
        )}
      </form>
    </section>
  );
}
