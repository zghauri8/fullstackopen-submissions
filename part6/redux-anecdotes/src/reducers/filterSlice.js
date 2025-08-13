import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter(_state, action) { return action.payload },
  },
})

export const { setFilter } = slice.actions
export default slice.reducer