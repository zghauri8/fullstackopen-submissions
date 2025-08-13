import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteSlice'
import { setNotification } from '../reducers/notificationSlice'

const Anecdote = ({ anecdote, onVote }) => (
  <div style={{ marginBottom: 10 }}>
    <div>{anecdote.content}</div>
    <div>has {anecdote.votes} <button onClick={onVote}>vote</button></div>
  </div>
)

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const list = filter
      ? anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
      : anecdotes
    return [...list].sort((a, b) => b.votes - a.votes)
  })

  const handleVote = (a) => {
    dispatch(voteAnecdote(a))
    dispatch(setNotification(`you voted '${a.content}'`, 5))
  }

  return (
    <div>
      {anecdotes.map(a => (
        <Anecdote key={a.id} anecdote={a} onVote={() => handleVote(a)} />
      ))}
    </div>
  )
}

export default AnecdoteList