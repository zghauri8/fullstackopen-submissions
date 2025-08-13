import { createSlice } from '@reduxjs/toolkit'
import * as api from '../services/anecdotes'

const slice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    replaceAnecdote(state, action) {
      const updated = action.payload
      return state.map(a => a.id === updated.id ? updated : a)
    },
  },
})

export const { setAnecdotes, appendAnecdote, replaceAnecdote } = slice.actions

// thunks
export const initializeAnecdotes = () => async (dispatch) => {
  const data = await api.getAll()
  dispatch(setAnecdotes(data))
}

export const createAnecdote = (content) => async (dispatch) => {
  const created = await api.createOne(content)
  dispatch(appendAnecdote(created))
}

export const voteAnecdote = (anecdote) => async (dispatch) => {
  const updated = await api.updateVotes(anecdote.id, { ...anecdote, votes: anecdote.votes + 1 })
  dispatch(replaceAnecdote(updated))
}

export default slice.reducer