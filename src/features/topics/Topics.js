import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ROUTES from "../../app/routes";
import { selectTopics, removeTopic } from "./topicsSlice";
import { removeQuiz } from "../quizzes/quizzesSlice";

export default function Topics() {
  const topics = useSelector(selectTopics);
  const dispatch = useDispatch();

  const handleDeleteTopic = (e, topicId, quizIds) => {
    e.preventDefault();
    e.stopPropagation();
    // Remove all quizzes associated with this topic
    if (quizIds) {
      quizIds.forEach((quizId) => {
        dispatch(removeQuiz({ id: quizId }));
      });
    }
    // Remove topic itself
    dispatch(removeTopic({ id: topicId }));
  };

  return (
    <section className="center">
      <h1>Topics</h1>
      <ul className="topics-list">
        {Object.values(topics).map((topic) => (
          <li className="topic" key={topic.id}>
            <Link to={ROUTES.topicRoute(topic.id)} className="topic-link">
             <div className="topic-container">
               <img src={topic.icon} alt="" />
               <div className="text-content">
                 <h2>{topic.name}</h2>
                 <p>{topic.quizIds.length} Quizzes</p>
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
      <Link
        to={ROUTES.newTopicRoute()}
        className="button create-new-topic-button"
      >
        Create New Topic
      </Link>
    </section>
  );
}

