import { configureStore } from "@reduxjs/toolkit";
import { topicsSlice } from "../features/topics/topicsSlice";
import { quizzesSlice } from "../features/quizzes/quizzesSlice";
import { cardsSlice } from "../features/cards/cardsSlice";
import resultsReducer from "../features/results/resultsSlice";
import { localStorageMiddleware, loadState } from "./localStorage";

const preloadedState = loadState();

export default configureStore({
  reducer: {
    topics: topicsSlice.reducer,
    quizzes: quizzesSlice.reducer,
    cards: cardsSlice.reducer,
    results: resultsReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});
