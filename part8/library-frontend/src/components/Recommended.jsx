import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../graphql'

const Recommended = ({ favorite }) => {
  const { data, loading } = useQuery(ALL_BOOKS, { variables: { genre: favorite } })
  if (loading) return <div>loading...</div>
  const books = data.allBooks
  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genre <strong>{favorite}</strong></div>
      <ul>
        {books.map(b => <li key={b.id}>{b.title} by {b.author.name}</li>)}
      </ul>
    </div>
  )
}
export default Recommended