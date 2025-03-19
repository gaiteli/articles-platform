// 有token正常跳转， 无token返回登陆页
import {getToken} from '/src/utils'
import { Navigate } from 'react-router-dom' // 重定向

export function AuthRoute({ children }) {
  const token = getToken()

  if (token) {
    return <>{children}</>
  } else {
    return <Navigate to={'/login'} replace />
  }

}