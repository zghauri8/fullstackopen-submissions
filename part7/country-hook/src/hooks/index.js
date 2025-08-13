import { useEffect, useState } from 'react'
import axios from 'axios'


export const useField = (type) => {
  const [value, setValue] = useState('')
  const onChange = (e) => setValue(e.target.value)
  const reset = () => setValue('')
  return { input: { type, value, onChange }, reset }
}

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    const fetchCountry = async () => {
      if (!name) { setCountry(null); return }
      try {
        const { data } = await axios.get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${encodeURIComponent(name)}`
        )
        setCountry({ found: true, data })
      } catch (err) {
        setCountry({ found: false })
      }
    }
    fetchCountry()
  }, [name])

  return country
}