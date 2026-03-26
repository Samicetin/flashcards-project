import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, Navigate, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import Card from "../cards/Card";
import QuizPlayer from "./QuizPlayer";
import EditQuizForm from "./EditQuizForm";
import Leaderboard from "../results/Leaderboard";
import ROUTES from "../../app/routes";
import { selectQuizzes, removeQuiz } from "./quizzesSlice";
import { removeQuizIdFromTopic } from "../topics/topicsSlice";
import { removeCard } from "../cards/cardsSlice";

export default function Quiz() {
  const quizzes = useSelector(selectQuizzes);
  const { user } = useOutletContext();
  const { quizId } = useParams();
  const quiz = quizzes[quizId];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(location.state?.startPlaying || false);
  const [isEditing, setIsEditing] = useState(location.state?.editing || false);

  if(!quiz) {
    return <Navigate to={ROUTES.quizzesRoute()} replace/>
  }

  const handleDeleteQuiz = () => {
    // Remove all cards associated with this quiz
    if (quiz.cardIds) {
      quiz.cardIds.forEach((cardId) => {
        dispatch(removeCard({ id: cardId }));
      });
    }
    // Remove quiz from topic
    dispatch(removeQuizIdFromTopic({ id: quizId, topicId: quiz.topicId }));
    // Remove quiz itself
    dispatch(removeQuiz({ id: quizId }));
    navigate(ROUTES.quizzesRoute());
  };

  if (isPlaying) {
    return (
      <section style={{ padding: 0 }}>
        <QuizPlayer quiz={quiz} onExit={() => setIsPlaying(false)} user={user} />
      </section>
    );
  }

  if (isEditing) {
    return (
      <EditQuizForm quiz={quiz} onCancel={() => setIsEditing(false)} />
    );
  }

  return (
    <section>
      <h1>{quiz.name}</h1>
      <div className="quiz-actions">
        <button onClick={() => setIsPlaying(true)} className="button play-quiz-button">
          ▶ Play Quiz
        </button>
        <button onClick={() => setIsEditing(true)} className="button button-edit">
          ✏️ Edit Quiz
        </button>
      </div>
      <ul className="cards-list">
        {quiz.cardIds && quiz.cardIds.map((id) => (
          <Card key={id} id={id} />
        ))}
      </ul>
      <Leaderboard quizId={quiz.id} />
      <Link to={ROUTES.newQuizRoute()} className="button center">
        Create a New Quiz
      </Link>
      <button onClick={handleDeleteQuiz} className="delete-button center">
        Delete Quiz
      </button>
    </section>
  );
}

