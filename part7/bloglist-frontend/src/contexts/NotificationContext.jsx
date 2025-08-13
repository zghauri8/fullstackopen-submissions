import { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { message: action.payload.message, type: action.payload.type || 'info' }
    case 'CLEAR':
      return { message: null, type: 'info' }
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { message: null, type: 'info' })
  return (
    <NotificationContext.Provider value={[state, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)