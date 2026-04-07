import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ROUTES from "../../app/routes";
import { selectTopics, removeTopic, addTopic } from "./topicsSlice";
import { getAllTopicsFromFirestore, deleteTopicFromFirestore } from "./firestoreTopics";
import { removeQuiz, selectQuizzes } from "../quizzes/quizzesSlice";
import { removeCard } from "../cards/cardsSlice";
import { deleteCardFromFirestore } from "../cards/firestoreCards";
import { deleteQuizFromFirestore, getQuizFromFirestore } from "../quizzes/firestoreQuizzes";
import { auth } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Topics() {
  const topics = useSelector(selectTopics);
  const quizzes = useSelector(selectQuizzes);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return;
      }
      try {
        const topicsFromDb = await getAllTopicsFromFirestore();
        Object.values(topicsFromDb).forEach((topic) => {
          dispatch(addTopic(topic));
        });
      } catch (error) {
        if (error?.code !== "permission-denied") {
          console.error("Failed to load topics:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleDeleteTopic = async (e, topicId, quizIds) => {
    e.preventDefault();
    e.stopPropagation();

    // Remove all quizzes associated with this topic
    if (quizIds) {
      for (const quizId of quizIds) {
        const quiz = quizzes[quizId] || (await getQuizFromFirestore(quizId));
        const cardIds = quiz?.cardIds || [];

        for (const cardId of cardIds) {
          dispatch(removeCard({ id: cardId }));
          await deleteCardFromFirestore(cardId);
        }

        dispatch(removeQuiz({ id: quizId }));
        await deleteQuizFromFirestore(quizId);
      }
    }

    // Remove topic itself
    dispatch(removeTopic({ id: topicId }));
    await deleteTopicFromFirestore(topicId);
  };

  const topicList = Object.values(topics);

  return (
    <section className="page-section center">
      <header className="page-header">
        <h1>Topics</h1>
        <p className="page-subtitle">Browse your quiz categories and manage them in one place.</p>
      </header>

      {topicList.length === 0 ? (
        <div className="empty-state">
          <h2>No topics yet</h2>
          <p>Create your first topic to start building quizzes.</p>
        </div>
      ) : (
        <ul className="topics-list">
          {topicList.map((topic) => (
            <li className="topic topic-tile" key={topic.id}>
              <Link to={ROUTES.topicRoute(topic.id)} className="topic-link">
                <div className="topic-container">
                  <img src={topic.icon} alt="" />
                  <div className="text-content">
                    <h2>{topic.name}</h2>
                    <p className="topic-quiz-count">{topic.quizIds.length} quizzes</p>
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) => handleDeleteTopic(e, topic.id, topic.quizIds)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="page-actions">
        <Link
          to={ROUTES.newTopicRoute()}
          className="button create-new-topic-button"
        >
          Create New Topic
        </Link>
      </div>
    </section>
  );
}

