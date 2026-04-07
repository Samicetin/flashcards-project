import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import ROUTES from "../../app/routes";
import { selectTopics, removeTopic, removeQuizIdFromTopic } from "../topics/topicsSlice";
import { selectQuizzes, removeQuiz } from "../quizzes/quizzesSlice";
import { removeCard } from "../cards/cardsSlice";
import { deleteCardFromFirestore } from "../cards/firestoreCards";
import { deleteQuizFromFirestore, getQuizFromFirestore } from "../quizzes/firestoreQuizzes";
import { deleteTopicFromFirestore, saveTopicToFirestore } from "../topics/firestoreTopics";
import SketchfabEmbed from "../../components/SketchfabEmbed";

export default function Topic() {
  const topics = useSelector(selectTopics);
  const quizzes = useSelector(selectQuizzes);
  const { topicId } = useParams();
  const topic = topics[topicId];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if(!topic) {
    return <Navigate to={ROUTES.topicsRoute()} replace/>
  }
  
  const quizzesForTopic = (topic.quizIds || [])
    .map((quizId) => quizzes[quizId])
    .filter(Boolean);

  const handleDeleteTopic = async () => {
    // Remove all quizzes associated with this topic
    if (topic.quizIds) {
      for (const quizId of topic.quizIds) {
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
    navigate(ROUTES.topicsRoute());
  };

  const handleDeleteQuiz = async (e, quiz) => {
    e.preventDefault();
    e.stopPropagation();

    for (const cardId of quiz.cardIds || []) {
      dispatch(removeCard({ id: cardId }));
      await deleteCardFromFirestore(cardId);
    }

    dispatch(removeQuiz({ id: quiz.id }));
    dispatch(removeQuizIdFromTopic({ id: quiz.id, topicId }));
    await deleteQuizFromFirestore(quiz.id);

    const nextQuizIds = (topic.quizIds || []).filter((id) => id !== quiz.id);
    await saveTopicToFirestore({ ...topic, quizIds: nextQuizIds });
  };

  return (
    <section className="page-section center">
      <img src={topic.icon} alt="" className="topic-icon" />
      <h1>{topic.name}</h1>
      <ul className="quizzes-list topic-quizzes-grid">
        {quizzesForTopic.length === 0 && <p>No quizzes in this topic yet.</p>}
        {quizzesForTopic.map((quiz) => (
          <li className="topic-quiz-card" key={quiz.id}>
            <Link to={ROUTES.quizRoute(quiz.id)} className="topic-quiz-link">
              <SketchfabEmbed />
              <p className="topic-quiz-name">{quiz.name}</p>
            </Link>
            <button
              onClick={(e) => handleDeleteQuiz(e, quiz)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="topic-page-actions">
        <Link to="/quizzes/new" className="button create-new-quiz-centered">
          Create a New Quiz
        </Link>
        <button
          onClick={handleDeleteTopic}
          className="delete-button"
        >
          Delete Topic
        </button>
      </div>
    </section>
  );
}
