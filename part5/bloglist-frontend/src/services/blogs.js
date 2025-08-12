import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const { data } = await axios.get(baseUrl)
  return data
}

const create = async newBlog => {
  const config = { headers: { Authorization: token } }
  const { data } = await axios.post(baseUrl, newBlog, config)
  return data
}

const update = async (id, updatedBlog) => {
  const { data } = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return data
}

const remove = async id => {
  const config = { headers: { Authorization: token } }
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, update, remove, setToken }