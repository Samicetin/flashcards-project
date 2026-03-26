import { createSlice } from '@reduxjs/toolkit'

export const cardsSlice = createSlice({
    name: 'cards',
    initialState: {
        cards: {}
    },
    reducers: {
        addCard: (state, action) => {
            const { id, front, back } = action.payload
            state.cards[id] = {
                id,
                front,
                back
            }
        },
        removeCard: (state, action) => {
            const { id } = action.payload
            delete state.cards[id]
        },
        updateCard: (state, action) => {
            const { id, front, back } = action.payload
            if (state.cards[id]) {
                state.cards[id].front = front
                state.cards[id].back = back
            }
        }
    }
})

export const selectCards = (state) => state.cards.cards
export const selectCardById = (state, cardId) => state.cards.cards[cardId]

export const { addCard, removeCard, updateCard } = cardsSlice.actions
export default cardsSlice.reducer