import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () => (await axios.get(baseUrl)).data

export const createOne = async (content) => {
  const anecdote = { content, votes: 0 }
  return (await axios.post(baseUrl, anecdote)).data
}

export const updateVotes = async (id, data) => {
  return (await axios.put(`${baseUrl}/${id}`, data)).data
}