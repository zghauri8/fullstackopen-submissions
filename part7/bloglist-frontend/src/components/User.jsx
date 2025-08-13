import { useParams, Link } from 'react-router-dom'

const User = ({ users }) => {
  const { id } = useParams()
  const user = users.find(u => u.id === id)
  if (!user) return null // conditional rendering to avoid crash on reload

  return (
    <div>
      <h2>{user.name || user.username}</h2>
      <h3>added blogs</h3>
      <ul>
        {(user.blogs || []).map(b => (
          <li key={b.id}><Link to={`/blogs/${b.id}`}>{b.title}</Link></li>
        ))}
      </ul>
    </div>
  )
}

export default User