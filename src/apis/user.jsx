// 用户有关的所有请求
import { request, removeToken } from "/src/utils";

// 登录
export function loginAPI (formData) {
  return request({
    url: '/login',
    method: 'POST',
    data: formData
  })
}

export function getUserInfoAPI() {
  return request({
    method: 'GET',
    url: '/user',
  })
}

// 退出清理用户信息
export function removeUserInfo(tokenDispatch, userDispatch) {
  tokenDispatch({type: 'remove'})
  userDispatch({type: 'remove'})
  removeToken()
}