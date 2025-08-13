import { useState } from 'react'
import { useField, useCountry } from './hooks'

const Country = ({ country }) => {
  if (!country) return null
  if (!country.found) return <div>not found...</div>
  const c = country.data
  return (
    <div>
      <h3>{c.name.common}</h3>
      <div>capital {c.capital?.[0]}</div>
      <div>population {c.population}</div>
      <img src={c.flags.png} height='100' alt={`flag of ${c.name.common}`} />
    </div>
  )
}

const App = () => {
  const name = useField('text')
  const [query, setQuery] = useState('')
  const country = useCountry(query)

  const fetch = (e) => {
    e.preventDefault()
    setQuery(name.input.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        find countries <input {...name.input} />
        <button>find</button>
      </form>
      <Country country={country} />
    </div>
  )
}

export default App