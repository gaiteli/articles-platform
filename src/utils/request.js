// axios的封装处理
import axios from "axios"
import { getToken, removeToken } from "./token"
import router from "/src/router"
import { message } from "antd"
// 1. 根域名配置
// 2. 超时时间
// 3. 请求拦截器 / 响应拦截器

const request = axios.create({
  baseURL: 'http://localhost:9000',
  timeout: 5000
})

// 添加请求拦截器
// 在请求发送之前 做拦截 插入一些自定义的配置 [参数的处理]
request.interceptors.request.use((config) => {
  // 操作这个config 注入token数据
  // 1. 获取到token
  // 2. 按照后端的格式要求做token拼接
  const token = getToken()
  console.log('axios send token');
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
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // 监控401 token失效
  console.log('401 error');
  console.dir(error)
  if (error.response.status === 401) {
    message.warning({ // 注意：使用antd给出的静态方法message.warning，不要用钩子这里不能用
      content: '账户信息已失效，请重新登录',
      duration: 2,
    })
    setTimeout(() => {
      removeToken()
      router.navigate('/login')
      window.location.reload()
    }, 1500)
    
  }
  return Promise.reject(error)
})

export { request }