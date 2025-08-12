import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => axios.get(baseUrl).then(res => res.data)

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson)
    .then(res => res.data)
    .catch(error => {
      throw new Error(error.response?.data?.error || 'Unknown error occurred')
    })
}

const update = (id, updatedPerson) => {
  return axios.put(`${baseUrl}/${id}`, updatedPerson)
    .then(res => res.data)
    .catch(error => {
      throw new Error(error.response?.data?.error || 'Unknown error occurred')
    })
}

const remove = (id) => axios.delete(`${baseUrl}/${id}`)

export default { getAll, create, update, remove }