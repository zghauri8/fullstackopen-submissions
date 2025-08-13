
import { useParams } from 'react-router-dom'

const Anecdote = ({ anecdotes }) => {
  const { id } = useParams()
  const anecdote = anecdotes.find(a => a.id === id)
  if (!anecdote) return null

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <div>has {anecdote.votes} votes</div>
      <div>for more info see <a href={anecdote.info}>{anecdote.info}</a></div>
      <div>by {anecdote.author}</div>
    </div>
  )
}

export default Anecdote