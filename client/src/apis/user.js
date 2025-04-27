// 用户有关的所有请求
import { request } from "/src/utils";

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

// 验证邮箱
export const verifyEmailAPI = (token) => {
  return request.get(`/verify-email?token=${token}`)
}

// 重新发送验证邮件
export const resendVerificationAPI = (email) => {
  return request.post('/resend-verification', { email })
}

// 发送忘记密码邮件
export const forgotPasswordAPI = (data) => {
  return request.post('/forgot-password', data)
}

// 验证重置密码的token
export const validateResetTokenAPI = (token) => {
  return request.get(`/validate-reset-token?token=${token}`)
}

// 重置密码
export const resetPasswordAPI = (data) => {
  return request.post('/reset-password', data)
}
