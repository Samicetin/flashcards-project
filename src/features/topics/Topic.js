import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import ROUTES from "../../app/routes";
import { selectTopics, removeTopic } from "../topics/topicsSlice";
import { selectQuizzes, removeQuiz } from "../quizzes/quizzesSlice";

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
  
  const quizzesForTopic = topic.quizIds.map((quizId) => quizzes[quizId]);

  const handleDeleteTopic = () => {
    // Remove all quizzes associated with this topic
    if (topic.quizIds) {
      topic.quizIds.forEach((quizId) => {
        dispatch(removeQuiz({ id: quizId }));
      });
    }
    // Remove topic itself
    dispatch(removeTopic({ id: topicId }));
    navigate(ROUTES.topicsRoute());
  };

  return (
    <section>
      <img src={topic.icon} alt="" className="topic-icon" />
      <h1>{topic.name}</h1>
      <ul className="quizzes-list">
        {quizzesForTopic.map((quiz) => (
          <li className="quiz" key={quiz.id}>
            <Link to={ROUTES.quizRoute(quiz.id)}>{quiz.name}</Link>
          </li>
        ))}
      </ul>
      <div style={{ position: 'relative', minHeight: '80px' }}>
        <Link to="/quizzes/new" className="button create-new-quiz-centered">
          Create a New Quiz
        </Link>
        <button
          onClick={handleDeleteTopic}
          className="delete-button delete-bottom-right"
          style={{ position: 'absolute', right: 0, bottom: 0 }}
        >
          Delete Topic
        </button>
      </div>
    </section>
  );
}
