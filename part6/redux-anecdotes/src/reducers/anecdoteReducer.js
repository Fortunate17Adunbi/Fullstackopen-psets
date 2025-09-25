
import { createSlice, current } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice =  createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      console.log('updateAnecdote action ', action)
      const id = action.payload.id
      const updated = action.payload
      return state.map(anec => anec.id !== id ? anec : updated)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    }
  }
})

export const { setAnecdotes, appendAnecdote, updateAnecdote } = anecdoteSlice.actions
export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
export const createAnecdote = (content) => {
  return async (dispatch) => {
    const created = await anecdoteService.create(content)
    dispatch(appendAnecdote(created))
  }
}
export const voteAnec = (id, anecdote) => {
  return async (dispatch) => {
    const updated = await anecdoteService.update(id, anecdote)
    dispatch(updateAnecdote(updated))
  }
}
export default anecdoteSlice.reducer