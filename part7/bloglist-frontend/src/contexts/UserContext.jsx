import { createContext, useContext, useReducer } from 'react'

const UserContext = createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return action.payload // null or { token, username, name }
    case 'LOGIN':
      return action.payload
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(reducer, null)
  return (
    <UserContext.Provider value={[user, dispatch]}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext) // returns [user, dispatch]