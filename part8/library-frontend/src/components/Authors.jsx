import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../graphql'
import { useState } from 'react'

const Authors = () => {
  const { data, loading, error, refetch } = useQuery(ALL_AUTHORS)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onCompleted: () => refetch(),
  })

  if (loading) return <div>loading...</div>
  if (error) return <div>error loading authors</div>

  const authors = data.allAuthors

  const submit = async (e) => {
    e.preventDefault()
    await editAuthor({ variables: { name, setBornTo: Number(born) } })
    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr><th>name</th><th>born</th><th>books</th></tr>
          {authors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td><td>{a.born || '-'}</td><td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={e => setName(e.target.value)}>
            <option value="" disabled>select author</option>
            {authors.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
          </select>
        </div>
        <div>
          born
          <input value={born} onChange={e => setBorn(e.target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors