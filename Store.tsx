import React, { createContext, useReducer, useContext } from 'react'
import { node } from 'prop-types'

type Coin = {}
type State = {
  coins: Array<Coin>
}

const initialState: State = {
  coins: [],
}
function reducer(state: State, action) {
  switch (action.type) {
    case 'FETCH_DATA':
      return { ...state, coins: action.payload }
    case 'FETCH_MORE_DATA':
      return { ...state, coins: [...state.coins, ...action.payload] }
    default:
      return state
  }
}
const Store = createContext(initialState)
function StoreProvider({ children }: any) {
  return <Store.Provider value={useReducer(reducer, initialState)}>{children}</Store.Provider>
}

StoreProvider.propTypes = {
  children: node,
}
const useStateValue = () => useContext(Store)

export { initialState, Store, reducer, StoreProvider, useStateValue }
