import { useParams } from 'react-router-dom'
import { useState } from 'react'

const BlogView = ({ blogs, user, onLike, onRemove, onAddComment }) => {
  const { id } = useParams()
  const blog = blogs.find(b => b.id === id)

  const [comment, setComment] = useState('')

  if (!blog) return null // conditional render on refresh

  const own = blog.user?.username === user?.username

  const submitComment = (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    onAddComment(blog.id, comment.trim())
    setComment('')
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <div><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></div>
      <div>
        likes {blog.likes}{' '}
        <button onClick={() => onLike(blog)}>like</button>
      </div>
      <div>added by {blog.user?.name || blog.user?.username || 'unknown'}</div>
      {own && <button onClick={() => onRemove(blog)}>remove</button>}

      <h3>comments</h3>
      <form onSubmit={submitComment} style={{ marginBottom: 10 }}>
        <input value={comment} onChange={e => setComment(e.target.value)} />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {(blog.comments || []).map((c, i) => <li key={`${blog.id}-c${i}`}>{c}</li>)}
      </ul>
    </div>
  )
}

export default BlogView