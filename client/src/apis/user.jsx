// 用户有关的所有请求
import { request, removeToken } from "/src/utils";

// 登录
export function loginAPI(formData) {
  return request({
    url: '/login',
    method: 'POST',
    data: formData
  })
}

// 注册
export function registerAPI(formData) {
  return request({
    url: '/register',
    method: 'POST',
    data: formData
  })
}


// 获取用户信息
// admin获取全部用户
export function getAllUsersInfoAPI(params) {
  return request({
    method: 'GET',
    url: '/admin/users',
    params
  })
}

// 普通用户
export function getUserInfoAPI() {
  return request({
    method: 'GET',
    url: '/users/me',
  })
}

// 更新用户信息
export function updateUserInfoAPI(id, params) {
  return request({
    method: 'PUT',
    url: `/admin/users/${id}`,
    data: params
  })
}

// 退出清理用户信息
export function removeUserInfo(tokenDispatch, userDispatch) {
  tokenDispatch({type: 'remove'})
  userDispatch({type: 'remove'})
  removeToken()
}