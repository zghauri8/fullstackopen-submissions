import { createSlice } from '@reduxjs/toolkit'

let timeoutId

const slice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    set(state, action) { return action.payload },
    clear() { return '' },
  },
})

export const { set, clear } = slice.actions

export const setNotification = (message, seconds = 5) => (dispatch) => {
  dispatch(set(message))
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => dispatch(clear()), seconds * 1000)
}

export default slice.reducer