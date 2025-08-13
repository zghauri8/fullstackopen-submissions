import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationSlice'
import blogsReducer from './reducers/blogsSlice'
import userReducer from './reducers/userSlice'

export default configureStore({
  reducer: { notification: notificationReducer, blogs: blogsReducer, user: userReducer },
})