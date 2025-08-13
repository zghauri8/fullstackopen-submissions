import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = (newToken) => { token = `Bearer ${newToken}` }

const getAll = async () => (await axios.get(baseUrl)).data
const create = async (newBlog) => {
  const config = { headers: { Authorization: token } }
  return (await axios.post(baseUrl, newBlog, config)).data
}
const update = async (id, updatedBlog) =>
  (await axios.put(`${baseUrl}/${id}`, updatedBlog)).data
const remove = async (id) => {
  const config = { headers: { Authorization: token } }
  await axios.delete(`${baseUrl}/${id}`, config)
}
const addComment = async (id, comment) =>
  (await axios.post(`${baseUrl}/${id}/comments`, { comment })).data

export default { getAll, create, update, remove, setToken, addComment }