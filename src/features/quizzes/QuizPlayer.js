import React, { useState, useEffect } from "react";
import { playSound } from "../../utils/sound";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../app/routes";
import { selectCards } from "../cards/cardsSlice";
import { addAttempt } from "../results/resultsSlice";

export default function QuizPlayer({ quiz, onExit }) {
  const cards = useSelector(selectCards);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cardIds = quiz.cardIds || [];
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(new Set());
  const [quizComplete, setQuizComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const currentCard = cards[cardIds[currentCardIndex]];
  const progress = answered.size;
  const totalCards = cardIds.length;
  const percentage = totalCards > 0 ? Math.round((progress / totalCards) * 100) : 0;

  useEffect(() => {
    if (quizComplete) {
      dispatch(addAttempt({ quizId: quiz.id, score, total: totalCards }));
      if (score === totalCards && totalCards > 0) {
        setShowConfetti(true);
        playSound("/sounds/crowd.mp3");
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
      } else if (score < totalCards && totalCards > 0) {
        playSound("/sounds/goat.mp3");
      }
    }
  }, [quizComplete, dispatch, quiz.id, score, totalCards]);

  if (cardIds.length === 0) {
    return (
      <div className="quiz-player">
        <h2>No cards in this quiz</h2>
        <button onClick={onExit} className="button">
          Back to Quiz
        </button>
      </div>
    );
  }

  const normalizeAnswer = (answer) => {
    return answer.toLowerCase().trim();
  };

  const handleSubmitAnswer = () => {
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(currentCard.back);
    
    if (!answered.has(currentCardIndex)) {
      setAnswered(new Set([...answered, currentCardIndex]));
      if (isCorrect) {
        setScore(score + 1);
      }
    }

    setFeedback(isCorrect ? "Correct!" : `Incorrect. The answer is: ${currentCard.back}`);
    
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const handleNext = () => {
    if (currentCardIndex < cardIds.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setUserAnswer("");
      setFeedback(null);
    } else {
      setQuizComplete(true);
    }
  };

  const handleLeaveQuiz = () => {
    if (window.confirm("Are you sure you want to leave this quiz? Your progress will not be saved.")) {
      navigate(ROUTES.quizzesRoute());
    }
  };

  if (quizComplete) {
    const percentage = Math.round((score / totalCards) * 100);
    return (
      <div className="quiz-player quiz-summary">
        {showConfetti && <div className="confetti-wrapper">
          {Array.from({ length: 80 }).map((_, i) => {
            return (
              <span
                key={i}
                className="confetti"
                style={{
                  "--c": Math.random(),
                  "--x": Math.random() * 100,
                  "--y": -20 - Math.random() * 20,
                  "--rot": (Math.random() * 360) - 180,
                  "--delay": `${Math.random() * 0.5}s`,
                  "--duration": `${1.5 + Math.random() * 1}s`,
                }}
              />
            );
          })}
        </div>}
        <h2>Quiz Complete!</h2>
        <div className="score-display">
          <p className="final-score">{score} / {totalCards}</p>
          <p className="score-percentage">{percentage}%</p>
        </div>
        <div className="summary-feedback">
          {percentage === 100 && <p>Perfect! You got them all!</p>}
          {percentage >= 80 && percentage < 100 && <p>Excellent work!</p>}
          {percentage >= 60 && percentage < 80 && <p>Good job! Keep practicing.</p>}
          {percentage < 60 && <p>Keep practicing to improve your score!</p>}
        </div>
        <div className="summary-buttons">
          <button onClick={handleLeaveQuiz} className="button">
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return <div className="quiz-player"><p>Loading...</p></div>;
  }

  return (
    <div className="quiz-player">
      <div className="quiz-header">
        <div className="quiz-header-top">
          <h2>{quiz.name}</h2>
          <button onClick={handleLeaveQuiz} className="button button-leave">
            Leave Quiz
          </button>
        </div>
        <p className="quiz-progress">
          Round {currentCardIndex + 1} of {totalCards}
        </p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      <div className="quiz-card-container">
        <div className="quiz-card question-card">
          <div className="card-content">
            <p className="card-label">Question</p>
            <p className="card-text">{currentCard.front}</p>
          </div>
        </div>
      </div>

      <div className="answer-input-section">
        <label htmlFor="answer-input" className="answer-label">Your Answer:</label>
        <input
          id="answer-input"
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.currentTarget.value)}
          onKeyPress={(e) => e.key === "Enter" && !feedback && handleSubmitAnswer()}
          placeholder="Type your answer here"
          className="answer-input"
          disabled={feedback !== null}
        />
      </div>

      {feedback && (
        <div className={`feedback ${feedback.includes("Correct") ? "feedback-correct" : "feedback-incorrect"}`}>
          <p>{feedback}</p>
        </div>
      )}

      <div className="quiz-controls">
        <button
          onClick={handleSubmitAnswer}
          className="button button-submit"
          disabled={userAnswer.trim().length === 0 || feedback !== null}
        >
          Submit Answer
        </button>
      </div>

      <p className="quiz-hint">Type your answer and press Enter or click Submit</p>
    </div>
  );
}
