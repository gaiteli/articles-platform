// 用户有关的所有请求
import { request, removeToken } from "/src/utils";

// 登录
export function loginAPI(formData) {
  return request({
    url: '/signin',
    method: 'POST',
    data: formData
  })
}

// 注册
export function registerAPI(formData) {
  return request({
    url: '/signup',
    method: 'POST',
    data: formData
  })
}


// 获取用户信息
export function getUserInfoAPI() {
  return request({
    method: 'GET',
    url: '/users/me',
  })
}

// 退出清理用户信息
export function removeUserInfo(tokenDispatch, userDispatch) {
  tokenDispatch({type: 'remove'})
  userDispatch({type: 'remove'})
  removeToken()
}