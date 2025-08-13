import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Menu from './components/Menu'
import AnecdoteList from './components/AnecdoteList'
import Anecdote from './components/Anecdote'
import CreateNew from './components/CreateNew'
import Notification from './components/Notification'
import Footer from './components/Footer'

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident.</em>
    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1',
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2',
    },
  ])
  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.random().toString(36).slice(2, 9)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const notify = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 5000)
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification message={notification} />

      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/create" element={<CreateNew addNew={addNew} notify={notify} />} />
        <Route path="/about" element={<About />} />
        <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes} />} />
      </Routes>

      <Footer />
    </div>
  )
}
export default App