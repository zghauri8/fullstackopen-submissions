import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../graphql'
import { useState } from 'react'

const Books = () => {
  const [genre, setGenre] = useState(null)
  const { data, loading, error, refetch } = useQuery(ALL_BOOKS, { variables: { genre } })

  if (loading) return <div>loading...</div>
  if (error) return <div>error loading books</div>

  const books = data.allBooks
  const genres = Array.from(new Set(books.flatMap(b => b.genres)))

  return (
    <div>
      <h2>books</h2>
      {genre && <div>in genre <strong>{genre}</strong></div>}
      <table>
        <tbody>
          <tr><th>title</th><th>author</th><th>published</th></tr>
          {books.map(b => (
            <tr key={b.title}>
              <td>{b.title}</td><td>{b.author}</td><td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 10 }}>
        {[...genres].map(g => (
          <button key={g} onClick={() => { setGenre(g); refetch({ genre: g }) }}>{g}</button>
        ))}
        <button onClick={() => { setGenre(null); refetch({ genre: null }) }}>all genres</button>
      </div>
    </div>
  )
}

export default Books