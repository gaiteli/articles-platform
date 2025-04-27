import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import './index.scss'
import { Card, Form, Input, Button, message, Flex, Checkbox, Row, Col } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import logo from '/src/assets/react.svg'
import { loginAPI } from '/src/apis/user'
import { getCaptchaAPI } from '/src/apis/articles_platform/captcha'
import { setToken } from "/src/utils"
import { AuthContext } from '/src/store/AuthContext';

export default function Login() {
  const { setAuthState } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation();
  const [captchaData, setCaptchaData] = useState('') // 存储验证码SVG数据
  const [captchaKey, setCaptchaKey] = useState('') // 存储验证码Key

  // 获取验证码
  const fetchCaptcha = async () => {
    try {
      const res = await getCaptchaAPI()
      setCaptchaData(res.data.captchaData)
      setCaptchaKey(res.data.captchaKey)
    } catch (error) {
      message.error('获取验证码失败')
    }
  }

  useEffect(() => {
    fetchCaptcha()
  }, [])


  const [form] = Form.useForm() // 不要忘了在Form的属性中绑定

  const onFinish = async (values) => {
    try {
      // 添加验证码信息到提交数据
      const submitData = {
        ...values,
        captchaKey,
        captchaText: values.captchaText,
        remember: values.remember || false
      }
      const res = await loginAPI(submitData)
      const token = res.data.token
      const user = res.data.user
      setToken(token)   // 存到localStorage
      setAuthState({ user: user, permissions: [] })

      // 获取跳转前的页面路径
      const { from } = location.state || { from: { pathname: '/' } };
      navigate(from)
      message.success('登陆成功！')
    } catch (error) {
      // 获取后端发来的‘密码错误’提示，并显示在校验错误提示处
      console.log('登陆信息提交遇到错误', error);
      // 登录失败时刷新验证码
      fetchCaptcha()

      if (error.response && error.response.data && error.response.data.errors) {
        const errorName = error.response.data.errors[0]
        if (errorName.includes('验证码')) {
          console.log('!!!!!!yanzhengma');
          form.setFields([
            {
              name: 'captchaText',
              errors: [errorName],
            },
          ]);
        } else {
          form.setFields([
            {
              name: 'password',
              errors: [errorName],
            },
          ]);
        }
      } else {
        message.error('登录失败，请稍后重试')
      }
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
          {/* 验证码部分 */}
          <Form.Item
            name="captchaText"
            rules={[
              {
                required: true,
                message: '验证码不能为空',
              },
            ]}>
            <Row gutter={8}>
              <Col span={16}>
                <Input size="large" placeholder="请输入验证码" />
              </Col>
              <Col span={8}>
                <div
                  className="captcha-img"
                  onClick={fetchCaptcha}
                  dangerouslySetInnerHTML={{ __html: captchaData }}
                  style={{ height: '40px', cursor: 'pointer' }}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item className="remember-forget">
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Link to="/forgot-password">忘记密码</Link>
            </Flex>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
          <Flex justify="space-between" align="center" className="register-and-back">
            <Link to="/register">没有账号？去注册</Link>
            <Link to="/articles">返回首页</Link>
          </Flex>
        </Form>
      </Card>
    </div>
  )
}
