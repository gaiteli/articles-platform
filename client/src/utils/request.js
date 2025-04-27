// axios的封装处理
import axios from "axios"
import { getToken, removeToken } from "./token"
import router from "/src/router"
import { message } from "antd"
import { useContext, useEffect } from 'react';
import { AuthContext } from '/src/store/AuthContext';

const request = axios.create({
  baseURL: 'http://localhost:9000',
  timeout: 10000
})

// 添加请求拦截器
// 在请求发送之前 做拦截 插入一些自定义的配置 [参数的处理]
request.interceptors.request.use((config) => {
  // 操作这个config 注入token数据
  // 1. 获取到token
  // 2. 按照后端的格式要求做token拼接
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加响应拦截器
// 在响应返回到客户端之前 做拦截 重点处理返回的数据
request.interceptors.response.use((response) => {
  // 2xx 范围内的状态码触发
  return response.data
}, (error) => {
  // 超出 2xx 范围的状态码触发
  console.log('axios拦截到响应错误', error);
  const { response } = error
  console.log(response)

  if (response) {
    switch (response.status) {

      case 400:
        const errorName = response.data.errors[0];
        if (errorName.includes('验证码')) break;    // 留给Login表单渲染到表单项下方
        if (response.data.subType === '01') {
          message.warning({
            content: errorName + '\n请检查无误后再提交',
            duration: 2,
          })
        }
        if (response.data.subType === '02') {
          message.warning({
            content: errorName + '\n2秒后自动跳转',
            duration: 2,
          })
          setTimeout(() => relogin(), 1900)
        }
        message.error({
          content: errorName,
          duration: 2,
        });
        break;

      case 401:
        const unauthorizedError = response.data.errors[0];
        if (unauthorizedError.includes('密码错误')) {
          message.warning({
            content: '密码错误，请检查！',
            duration: 2,
          });
        } else {
          message.warning({ // 注意：使用antd给出的静态方法message.warning，不要用钩子这里不能用
            content: '账户信息已失效，请重新登录。\n2秒后自动跳转',
            duration: 2,
          });
          setTimeout(() => relogin(), 1900);
        }
        break;

      case 403:
        // <Navigate to=''
        message.error({
          content: '您没有权限访问该资源。',
          duration: 2,
        });
        break;

      case 404:
        // 处理 404 未找到
        message.error({
          content: '请求的资源未找到。',
          duration: 2,
        });
        break;

      case 500:
        // 处理 500 服务器错误
        // 邮件发送550错误
        if (response.data.message.includes('550')) {    
          message.error('邮件发送失败，请检查邮件地址是否正确! ')
          setTimeout(() => {
            message.warning('若无误，请尝试再次注册，若仍失败请联系管理员。')
          }, 2000)
          break;
        }
        // 其它错误
        message.error({
          content: '服务器内部错误，请稍后再试。',
          duration: 2,
        });
        break;

      default:
        message.error({
          content: `未知错误: code:${response.status}, message:${response.data.errors[0]}`,
          duration: 2,
        });
        break;
    }
  } else {
    // 服务器未返回状态码，可能是网络错误
    message.error({
      content: '网络请求失败，请检查您的网络连接。',
      duration: 2,
    });
  }

  return Promise.reject(error)
})

function relogin() {
  removeToken();
  router.navigate('/login', { replace: true });
  // window.location.reload();
}

export { request }