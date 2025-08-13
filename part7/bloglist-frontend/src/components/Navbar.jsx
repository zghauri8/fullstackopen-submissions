import { Link } from 'react-router-dom'

const NavBar = ({ user, onLogout }) => {
  const linkStyle = { paddingRight: 10 }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
      <div>
        <Link to="/" style={linkStyle}>blogs</Link>
        <Link to="/users" style={linkStyle}>users</Link>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        {user?.name} logged in <button onClick={onLogout}>logout</button>
      </div>
    </div>
  )
}

export default NavBar