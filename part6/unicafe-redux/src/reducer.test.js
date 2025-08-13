import deepFreeze from 'deep-freeze'
import counterReducer, { initialState } from './reducer'

describe('unicafe reducer', () => {
  test('should return proper initial state with undefined state', () => {
    const action = { type: 'DO_NOTHING' }
    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = { type: 'GOOD' }
    const state = initialState
    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({ good: 1, ok: 0, bad: 0 })
  })

  test('ok is incremented', () => {
    const action = { type: 'OK' }
    const state = initialState
    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({ good: 0, ok: 1, bad: 0 })
  })

  test('bad is incremented', () => {
    const action = { type: 'BAD' }
    const state = initialState
    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({ good: 0, ok: 0, bad: 1 })
  })

  test('zero resets all', () => {
    const state = { good: 10, ok: 5, bad: 2 }
    deepFreeze(state)
    const newState = counterReducer(state, { type: 'ZERO' })
    expect(newState).toEqual({ good: 0, ok: 0, bad: 0 })
  })
})