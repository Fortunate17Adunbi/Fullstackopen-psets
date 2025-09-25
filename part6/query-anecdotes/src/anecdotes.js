
import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes/'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(resp => resp.data)
export const createAnecdote = (createdAnecdote) =>
  axios.post(baseUrl, createdAnecdote).then(resp => resp.data)
export const updateAnecdote = (updatedAnecdote) =>
  axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then(resp => resp.data)