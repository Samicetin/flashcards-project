import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../../app/routes";
import { selectQuizzes, removeQuiz, addQuiz } from "./quizzesSlice";
import { getAllQuizzesFromFirestore, deleteQuizFromFirestore } from "./firestoreQuizzes";
import { removeQuizIdFromTopic, selectTopics } from "../topics/topicsSlice";
import { getAllCardsFromFirestore, deleteCardFromFirestore } from "../cards/firestoreCards";
import { addCard, removeCard } from "../cards/cardsSlice";
import { saveTopicToFirestore } from "../topics/firestoreTopics";
import SketchfabEmbed from "../../components/SketchfabEmbed";
import { auth } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Quizzes() {
  const quizzes = useSelector(selectQuizzes);
  const topics = useSelector(selectTopics);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return;
      }
      try {
        const quizzesFromDb = await getAllQuizzesFromFirestore();
        Object.values(quizzesFromDb).forEach((quiz) => {
          dispatch(addQuiz(quiz));
        });
        const cardsFromDb = await getAllCardsFromFirestore();
        Object.values(cardsFromDb).forEach((card) => {
          dispatch(addCard(card));
        });
      } catch (error) {
        if (error?.code !== "permission-denied") {
          console.error("Failed to load quizzes/cards:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleDeleteQuiz = async (e, quizId, topicId, cardIds = []) => {
    e.preventDefault();
    e.stopPropagation();

    for (const cardId of cardIds) {
      dispatch(removeCard({ id: cardId }));
      await deleteCardFromFirestore(cardId);
    }

    dispatch(removeQuiz({ id: quizId }));
    dispatch(removeQuizIdFromTopic({ id: quizId, topicId }));
    await deleteQuizFromFirestore(quizId);

    if (topicId && topics[topicId]) {
      const nextQuizIds = (topics[topicId].quizIds || []).filter((id) => id !== quizId);
      await saveTopicToFirestore({ ...topics[topicId], quizIds: nextQuizIds });
    }
  };

  const handlePlayQuiz = (e, quizId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(ROUTES.quizRoute(quizId), { state: { startPlaying: true } });
  };

  const handleEditQuiz = (e, quizId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(ROUTES.quizRoute(quizId), { state: { editing: true } });
  };

  const quizList = Object.values(quizzes);

  return (
    <section className="page-section center">
      <header className="page-header">
        <h1>Quizzes</h1>
        <p className="page-subtitle">Play, edit, or remove quizzes from your collection.</p>
      </header>

      {quizList.length === 0 ? (
        <div className="empty-state">
          <h2>No quizzes yet</h2>
          <p>Create a quiz and start practicing right away.</p>
        </div>
      ) : (
        <ul className="quizzes-list">
          {quizList.map((quiz) => (
            <li key={quiz.id} className="quiz-item">
              <div className="quiz">
                <SketchfabEmbed />
                <p className="quiz-name-label">{quiz.name}</p>
              </div>
              <div className="quiz-item-buttons">
                <button
                  onClick={(e) => handlePlayQuiz(e, quiz.id)}
                  className="button play-quiz-button"
                >
                  Play
                </button>
                <button
                  onClick={(e) => handleEditQuiz(e, quiz.id)}
                  className="button button-edit"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDeleteQuiz(e, quiz.id, quiz.topicId, quiz.cardIds)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="page-actions">
        <Link to={ROUTES.newQuizRoute()} className="button">
          Create New Quiz
        </Link>
      </div>
    </section>
  );
}

