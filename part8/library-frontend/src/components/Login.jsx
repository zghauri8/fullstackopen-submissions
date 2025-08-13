import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { LOGIN } from '../graphql'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login] = useMutation(LOGIN, {
    onCompleted: ({ login }) => onLogin(login.value),
    onError: () => alert('wrong credentials'),
  })

  const submit = (e) => {
    e.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <form onSubmit={submit}>
      <div>username <input value={username} onChange={e => setUsername(e.target.value)} /></div>
      <div>password <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
      <button type="submit">login</button>
    </form>
  )
}
export default Login