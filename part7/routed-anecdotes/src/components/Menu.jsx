
import { NavLink } from 'react-router-dom'

const Menu = () => {
  const padding = { paddingRight: 10 }
  const linkStyle = ({ isActive }) => ({
    ...padding,
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none'
  })

  return (
    <div>
      <NavLink to="/" style={linkStyle}>anecdotes</NavLink>
      <NavLink to="/create" style={linkStyle}>create new</NavLink>
      <NavLink to="/about" style={linkStyle}>about</NavLink>
    </div>
  )
}

export default Menu