import React from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import { Card, Form, Input, Button, message } from 'antd'
import logo from '/src/assets/react.svg'
import myFetch from '/src/utils/myFetch.js'
import { loginAPI } from '../../apis/user'
import { useGlobals, useGlobalsDispatch } from '/src/store/globalContext'
import { setToken } from "/src/utils"

// 使用该命令启动后端服务：nodemon ./src/app.js，注意./不能省略
export default function Login() {
  const navigate = useNavigate()
  let { token } = useGlobals()
  const { tokenDispatch } = useGlobalsDispatch()

  const onFinish = async (values) => {
   
    // const res = await myFetch('http://localhost:9000/login', values)
    const res = await loginAPI(values)
    const data = res
    console.log('拿到的token:'+data.token);

    // 把这一部分逻辑分离出去
    if (data.token) {
      token = data.token

      await tokenDispatch({
        type: 'add',
        token: token,
      })
      await tokenDispatch({ type: 'display'}) // 打印token确认已经存入reduer中
  
      setToken(token)
      // 跳转到首页
      navigate('/')
      message.success('login success')
    }
  }

  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        {/* 增加失焦时校验 */}
        <Form validateTrigger="onBlur" onFinish={onFinish}> 
          <Form.Item
            name="mobile"
            rules={[  // 多条校验逻辑 先校验第一条 第一条通过之后再校验第二条
              {
                required: true,
                message: '请输入手机号',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入正确的手机号格式',
              },
            ]}>
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[
              {
                required: true,
                message: '请输入验证码',
              },
            ]}> 
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
