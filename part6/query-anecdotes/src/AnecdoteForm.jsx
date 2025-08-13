import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useNotification } from './NotificationContext'

const createAnecdote = async (content) => {
  const obj = { content, votes: 0 }
  const { data } = await axios.post('http://localhost:3001/anecdotes', obj)
  return data
}

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [_, dispatch] = useNotification()

  const notify = (msg) => {
    dispatch({ type: 'SET', payload: msg })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnec) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnec))
      notify(`new anecdote '${newAnec.content}'`)
    },
    onError: (error) => {
      // server validation error (e.g. content too short)
      const msg = error.response?.data?.error || 'creation failed'
      notify(msg)
    },
  })

  const onCreate = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.anecdote.value = ''
    newAnecdoteMutation.mutate(content)
  }

  return (
    <form onSubmit={onCreate}>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm