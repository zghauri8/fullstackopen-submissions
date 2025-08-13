import { Link } from 'react-router-dom'

const Users = ({ users }) => {
  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr><th></th><th>blogs created</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td><Link to={`/users/${u.id}`}>{u.name || u.username}</Link></td>
              <td>{u.blogs?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default Users