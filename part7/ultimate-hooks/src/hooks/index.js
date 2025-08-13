import { useEffect, useState } from 'react'
import axios from 'axios'

export const useField = (type) => {
  const [value, setValue] = useState('')
  const onChange = (e) => setValue(e.target.value)
  const reset = () => setValue('')
  return { input: { type, value, onChange }, reset }
}

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await axios.get(baseUrl)
      setResources(data)
    }
    fetchAll()
  }, [baseUrl])

  const create = async (resource) => {
    const { data } = await axios.post(baseUrl, resource)
    setResources((prev) => prev.concat(data))
    return data
  }

  return [resources, { create }]
}