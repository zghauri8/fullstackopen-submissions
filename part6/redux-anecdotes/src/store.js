import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer from './reducers/anecdoteSlice'
import filterReducer from './reducers/filterSlice'
import notificationReducer from './reducers/notificationSlice'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer,
  },
})

export default store