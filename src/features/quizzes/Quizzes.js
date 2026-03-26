import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../../app/routes";
import { selectQuizzes, removeQuiz } from "./quizzesSlice";
import { removeQuizIdFromTopic } from "../topics/topicsSlice";

export default function Quizzes() {
  const quizzes = useSelector(selectQuizzes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteQuiz = (e, quizId, topicId) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeQuiz({ id: quizId }));
    dispatch(removeQuizIdFromTopic({ id: quizId, topicId }));
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

  return (
    <section className="center">
      <h1>Quizzes</h1>
      <ul className="quizzes-list">
        {Object.values(quizzes).map((quiz) => (
          <div key={quiz.id} className="quiz-item">
            <div className="quiz">{quiz.name}</div>
            <div className="quiz-item-buttons">
              <button 
                onClick={(e) => handlePlayQuiz(e, quiz.id)}
                className="button play-quiz-button"
              >
                ▶ Play
              </button>
              <button 
                onClick={(e) => handleEditQuiz(e, quiz.id)}
                className="button button-edit"
              >
                ✏️ Edit
              </button>
              <button 
                onClick={(e) => handleDeleteQuiz(e, quiz.id, quiz.topicId)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </ul>
      <Link to={ROUTES.newQuizRoute()} className="button">
        Create New Quiz
      </Link>
    </section>
  );
}

