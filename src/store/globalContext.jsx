import { createContext, useContext, useReducer } from "react";
import { setToken, getToken, removeToken } from "/src/utils"

export const GlobalsContext = createContext(null)
export const GlobalsDispatchContext = createContext(null)

export const TokenContext = createContext(null)
export const TokenDispatchContext = createContext(null)

export const UserContext = createContext(null)
export const UserDispatchContext = createContext(null)

// global = token + user
const initialToken = getToken() || ''
export function GlobalsProvider({ children }) {
  //token
  const [token, tokenDispatch] = useReducer((state, action) => {
    return tokenReducer(state, action);
  }, initialToken);

  //User
  const [user, userDispatch] = useReducer((state, action) => {
    return userReducer(state, action);
  }, {user_id: '', user_name: '请登陆'})  

  const value = { token, user }
  const dispatch = { tokenDispatch, userDispatch }
  return (
    <GlobalsContext.Provider value={value}>
      <GlobalsDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalsDispatchContext.Provider>
    </GlobalsContext.Provider>
  )
}

export function useGlobals() {
  return useContext(GlobalsContext)
}
export function useGlobalsDispatch() {
  return useContext(GlobalsDispatchContext)
}

// token
// const initialToken = getToken() || ''
// export function TokenProvider({ children }) {
//   const [token, dispatch] = useReducer((state, action) => {
//     return tokenReducer(state, action);
//   }, initialToken);

//   return (
//     <TokenContext.Provider value={token}>
//       <TokenDispatchContext.Provider value={dispatch}>
//         {children}
//       </TokenDispatchContext.Provider>
//     </TokenContext.Provider>
//   )
// }

// export function useToken() {
//   return useContext(TokenContext)
// }
// export function useTokenDispatch() {
//   return useContext(TokenDispatchContext)
// }

function tokenReducer(token, action) {
  console.log('token Reducer called with action:', action)
  switch (action.type) {
    case 'add': {
      return action.token
    }
    case 'remove': {
      return ''
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

function userReducer(user, action) {
  console.log('user Reducer called with action:', action)
  switch (action.type) {
    case 'set': {
      return action.user
    }
    case 'remove': {
      return {}
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}

// User
