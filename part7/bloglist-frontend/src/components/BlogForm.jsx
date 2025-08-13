import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = e => {
    e.preventDefault()
    onCreate({ title, author, url })
    setTitle(''); setAuthor(''); setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>title <input value={title} onChange={e => setTitle(e.target.value)} id="title" /></div>
      <div>author <input value={author} onChange={e => setAuthor(e.target.value)} id="author" /></div>
      <div>url <input value={url} onChange={e => setUrl(e.target.value)} id="url" /></div>
      <button type="submit">create</button>
    </form>
  )
}

BlogForm.propTypes = { onCreate: PropTypes.func.isRequired }
export default BlogForm