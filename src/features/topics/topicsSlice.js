import { createSlice } from '@reduxjs/toolkit'

export const topicsSlice = createSlice({
    name: 'topics',
    initialState: {
        topics: {}
    },
    reducers: {
        addTopic: (state, action) => {
            const { id, name, icon } = action.payload
            state.topics[id] = {
                id,
                name,
                icon,
                quizIds: []
            }
        },
        addQuizIdToTopic: (state, action) => {
            const { id: quizId, topicId } = action.payload
            if (!topicId || !state.topics[topicId]) {
                return
            }
            if (!state.topics[topicId].quizIds.includes(quizId)) {
                state.topics[topicId].quizIds.push(quizId)
            }
        },
        removeQuizIdFromTopic: (state, action) => {
            const { id: quizId, topicId } = action.payload
            if (!topicId || !state.topics[topicId]) {
                return
            }
            state.topics[topicId].quizIds = state.topics[topicId].quizIds.filter(id => id !== quizId)
        },
        removeTopic: (state, action) => {
            const { id } = action.payload
            delete state.topics[id]
        }
    }
})

export const selectTopics = (state) => state.topics.topics

export const { addTopic, addQuizIdToTopic, removeQuizIdFromTopic, removeTopic } = topicsSlice.actions
export default topicsSlice.reducer