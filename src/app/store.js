import { configureStore } from "@reduxjs/toolkit";
// import reducers
import { topicsSlice } from "../features/topics/topicsSlice";  
import { quizzesSlice } from "../features/quizzes/quizzesSlice";  
import { cardsSlice } from "../features/cards/cardsSlice";
import resultsReducer from "../features/results/resultsSlice";

export default configureStore({
  reducer: {
    topics: topicsSlice.reducer,
    quizzes: quizzesSlice.reducer,
    cards: cardsSlice.reducer,
    results: resultsReducer,
  },
});
