import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS } from '../graphql'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
  })

  const submit = async (e) => {
    e.preventDefault()
    await addBook({ variables: { title, author, published: Number(published), genres } })
    setTitle(''); setAuthor(''); setPublished(''); setGenres([]); setGenre('')
  }

  const addGenre = () => {
    if (genre && !genres.includes(genre)) setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>add book</h2>
      <form onSubmit={submit}>
        <div>title <input value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div>author <input value={author} onChange={e => setAuthor(e.target.value)} /></div>
        <div>published <input value={published} onChange={e => setPublished(e.target.value)} /></div>
        <div>
          <input value={genre} onChange={e => setGenre(e.target.value)} />
          <button onClick={addGenre} type="button">add genre</button>
          <div>genres: {genres.join(' ')}</div>
        </div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook