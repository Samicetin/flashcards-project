import { createSlice } from '@reduxjs/toolkit'

export const quizzesSlice = createSlice({
    name: 'quizzes',
    initialState: {
        quizzes: {}
    },
    reducers: {
        addQuiz: (state, action) => {
            const { id, name, topicId, cardIds } = action.payload
            state.quizzes[id] = {
                id,
                name,
                topicId,
                cardIds: cardIds || []
            }
        },
        removeQuiz: (state, action) => {
            const { id } = action.payload
            delete state.quizzes[id]
        },
        updateQuizCardIds: (state, action) => {
            const { id, cardIds } = action.payload
            if (state.quizzes[id]) {
                state.quizzes[id].cardIds = cardIds
            }
        }
    }
})

export const selectQuizzes = (state) => state.quizzes.quizzes
export const { addQuiz, removeQuiz, updateQuizCardIds } = quizzesSlice.actions
export default quizzesSlice.reducer
