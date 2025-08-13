
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Notification from './Notification'
import AnecdoteForm from './AnecdoteForm'
import { useNotification } from './NotificationContext'

const baseUrl = 'http://localhost:3001/anecdotes'

const App = () => {
  const queryClient = useQueryClient()
  const [_, dispatch] = useNotification()

  const notify = (msg) => {
    dispatch({ type: 'SET', payload: msg })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  // Fetch anecdotes
  const { data: anecdotes = [], isLoading, isError } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: async () => (await axios.get(baseUrl)).data,
  })

  
  const voteMutation = useMutation({
    mutationFn: async (anec) => {
      const updated = { ...anec, votes: anec.votes + 1 }
      return (await axios.put(`${baseUrl}/${anec.id}`, updated)).data
    },
    onSuccess: (updated) => {
      const current = queryClient.getQueryData(['anecdotes']) || []
      queryClient.setQueryData(
        ['anecdotes'],
        current.map((a) => (a.id === updated.id ? updated : a))
      )
      notify(`you voted '${updated.content}'`)
    },
  })

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote)
  }

  if (isLoading) return <div>loading data...</div>
  if (isError) return <div>failed to load</div>

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id} style={{ marginBottom: 10 }}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}{' '}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App