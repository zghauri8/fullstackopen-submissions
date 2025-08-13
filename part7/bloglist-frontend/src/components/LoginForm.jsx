import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    onLogin({ username, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input
          data-testid="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          id="username"
        />
      </div>
      <div>
        password
        <input
          data-testid="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          id="password"
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

LoginForm.propTypes = { onLogin: PropTypes.func.isRequired }
export default LoginForm