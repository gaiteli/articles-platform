import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './index.scss'
import { Card, Form, Input, Button, message, Flex, Checkbox } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import logo from '/src/assets/react.svg'
import { loginAPI } from '/src/apis/user'
import { useGlobals, useGlobalsDispatch } from '/src/store/globalContext'
import { setToken } from "/src/utils"

export default function Login() {
  const navigate = useNavigate()
  let { token } = useGlobals()
  const { tokenDispatch } = useGlobalsDispatch()

  const [form] = Form.useForm() // 不要忘了在Form的属性中绑定

  const onFinish = async (values) => {
    try {
      const res = await loginAPI(values)
      const token = res.data.token
      console.log('拿到的token:' + token);

      // 把这一部分逻辑分离出去
      if (token) {
        await tokenDispatch({ type: 'add', token: token })  // token存入Context中
        await tokenDispatch({ type: 'display' })    // 打印token确认已经存入
        setToken(token)   // 存到localStorage
        navigate('/')   // 跳转到首页
        message.success('login success')
      }
    } catch(error) {
      // 获取后端发来的‘密码错误’提示，并显示在校验错误提示处
      const errorName = error.response.data.errors[0]
      form.setFields([
        {
          name: 'password',
          errors: [errorName], // 修改错误提示
        },
      ]);
    }
  }

  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        {/* 增加失焦时校验 */}
        <Form validateTrigger="onBlur" onFinish={onFinish} form={form}>
          <Form.Item
            name="login"
            rules={[
              {
                required: true,
                message: '用户名/账号名不能为空',
              }
            ]}>
            <Input size="large" placeholder="请输入用户名或账号名" prefix={<UserOutlined />} />
          </Form.Item>
          {/* <Form.Item
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
          </Form.Item> */}
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '密码不能为空',
              },
              {
                min: 6,
                message: '密码长度不能小于6个字符',
              }
            ]}
          >
            <Input.Password size="large" placeholder="请输入密码" prefix={<LockOutlined />} />
          </Form.Item>
          {/* <Form.Item
            name="code"
            rules={[
              {
                required: true,
                message: '请输入验证码',
              },
            ]}>
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item> */}
          <Form.Item className="remember-forget">
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <a href="">忘记密码</a>
            </Flex>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
          <Link to="/signup">没有账号？去注册</Link>
        </Form>
      </Card>
    </div>
  )
}
