import { createSlice } from "@reduxjs/toolkit";

export const resultsSlice = createSlice({
  name: "results",
  initialState: {
    attempts: {}
  },
  reducers: {
    addAttempt: (state, action) => {
      const { quizId, score, total } = action.payload;
      state.attempts[quizId] = {
        quizId,
        score,
        total,
        win: score === total,
        lastAttempt: new Date().toISOString(),
      };
    },
  },
});

export const selectAttempts = (state) => state.results.attempts;
export const selectHasResults = (state) => Object.keys(state.results.attempts).length > 0;

export const { addAttempt } = resultsSlice.actions;
export default resultsSlice.reducer;
