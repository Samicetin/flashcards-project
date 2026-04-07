import React from "react";
import {
  Navigate,
  Route,
  HashRouter,
  Routes
} from "react-router-dom";
import NewQuizForm from "../components/NewQuizForm";
import NewTopicForm from "../components/NewTopicForm";
import Topics from "../features/topics/Topics";
import Topic from "../features/topics/Topic";
import Quiz from "../features/quizzes/Quiz";
import Quizzes from "../features/quizzes/Quizzes";
import Results from "../features/results/Results";
import AppLayout from "./AppLayout";

export default function App() {
  return (
    <HashRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
      <Route path="/" element={<AppLayout/>}>
    <Route index element={<Navigate to="topics" replace />} />
    <Route path="topics" element={<Topics/>}/>
    <Route path="topics/new" element={<NewTopicForm/>}/>
    <Route path="topics/:topicId" element={<Topic/>}/>
    <Route path="quizzes" element={<Quizzes/>}/>
    <Route path="quizzes/new" element={<NewQuizForm/>}/>
    <Route path="quizzes/:quizId" element={<Quiz/>}/>
    <Route path="results" element={<Results/>}/>
  </Route>
      </Routes>
    </HashRouter>
  )
}
