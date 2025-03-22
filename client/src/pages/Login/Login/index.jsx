import React, { useState, useContext } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import './index.scss'
import { Card, Form, Input, Button, message, Flex, Checkbox } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import logo from '/src/assets/react.svg'
import { loginAPI } from '/src/apis/user'
import { setToken } from "/src/utils"
import { AuthContext } from '/src/store/AuthContext';

export default function Login() {
  const { setAuthState }  = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation();

  const [form] = Form.useForm() // 不要忘了在Form的属性中绑定

  const onFinish = async (values) => {
    try {
      const res = await loginAPI(values)
      const token = res.data.token
      const user = res.data.user
      setToken(token)   // 存到localStorage
      setAuthState({user: user, permissions: []})

      // 获取跳转前的页面路径
      const { from } = location.state || { from: { pathname: '/' } };
      navigate(from)
      message.success('登陆成功！')
    } catch (error) {
      // 获取后端发来的‘密码错误’提示，并显示在校验错误提示处
      console.log(error);
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
          <Link to="/register">没有账号？去注册</Link>
        </Form>
      </Card>
    </div>
  )
}
