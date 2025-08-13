import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  const sorted = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <div>
      <h2>blogs</h2>
      <ul>
        {sorted.map(b => (
          <li key={b.id}>
            <Link to={`/blogs/${b.id}`}>{b.title} {b.author}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList