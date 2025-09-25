
import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}
const create = async (content) => {
  const anecdoteObj =  { content, votes: 0 }
  const response = await axios.post(baseUrl, anecdoteObj)
  return response.data
}
const update = async (id, anecdoteObj) => {
  const toBeUpdated = { ...anecdoteObj, votes: anecdoteObj.votes + 1 }
  const response = await axios.put(`${baseUrl}/${id}`, toBeUpdated)
  return response.data
}

export default {
  getAll, create, update
}