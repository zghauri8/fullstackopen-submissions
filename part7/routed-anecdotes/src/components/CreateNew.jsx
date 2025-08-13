import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'

const CreateNew = ({ addNew, notify }) => {
  const navigate = useNavigate()
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
      content: content.input.value,
      author: author.input.value,
      info: info.input.value,
      votes: 0,
    })
    notify(`a new anecdote "${content.input.value}" created`)
    navigate('/')
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>content <input {...content.input} /></div>
        <div>author <input {...author.input} /></div>
        <div>url for more info <input {...info.input} /></div>
        <button type="submit">create</button>{' '}
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}
export default CreateNew