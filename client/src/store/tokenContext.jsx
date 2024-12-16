import { createContext, useContext, useReducer } from "react";
import { setToken, getToken, removeToken } from "/src/utils"

export const TokenContext = createContext(null)
export const TokenDispatchContext = createContext(null)

const initialToken = getToken() || ''
export function TokenProvider({ children }) {
  const [token, dispatch] = useReducer((state, action) => {
    return tokenReducer(state, action);
  }, initialToken);

  return (
    <TokenContext.Provider value={token}>
      <TokenDispatchContext.Provider value={dispatch}>
        {children}
      </TokenDispatchContext.Provider>
    </TokenContext.Provider>
  )
}

export function useToken() {
  return useContext(TokenContext)
}

export function useTokenDispatch() {
  return useContext(TokenDispatchContext)
}

function tokenReducer(token, action) {
  console.log('Reducer called with action:', action)
  switch (action.type) {
    case 'add': {
      return action.token
    }
    case 'display': {
      console.log('now the token:'+token+'is in the reducer!')
      return token
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}
