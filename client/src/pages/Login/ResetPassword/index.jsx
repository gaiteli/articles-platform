import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Card, Form, Input, Button, message, Result, Spin } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import logo from '/src/assets/react.svg'
import { validateResetTokenAPI, resetPasswordAPI } from '/src/apis/user'
import './index.scss'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // 从URL获取token
  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setValidating(false)
      setLoading(false)
      setErrorMsg('无效的重置链接')
      return
    }

    // 验证token
    const validateToken = async () => {
      try {
        await validateResetTokenAPI(token)
        setTokenValid(true)
      } catch (error) {
        if (error.response && error.response.data) {
          setErrorMsg(error.response.data.message || '重置链接无效')
        } else {
          setErrorMsg('重置链接无效或已过期')
        }
      } finally {
        setValidating(false)
        setLoading(false)
      }
    }

    validateToken()
  }, [token])

  const onFinish = async (values) => {
    try {
      setLoading(true)
      await resetPasswordAPI({
        token,
        password: values.password
      })
      setResetSuccess(true)
      message.success('密码重置成功')
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || '密码重置失败')
      } else {
        message.error('密码重置失败')
      }
    } finally {
      setLoading(false)
    }
  }

  // 显示验证中状态
  if (validating) {
    return (
      <div className="reset-password">
        <Card className="reset-password-container">
          <div className="validating">
            <Spin size="large" />
            <p>正在验证重置链接，请稍候...</p>
          </div>
        </Card>
      </div>
    )
  }

  // 显示重置成功状态
  if (resetSuccess) {
    return (
      <div className="reset-password">
        <Card className="reset-password-container">
          <Result
            status="success"
            title="密码重置成功！"
            subTitle="您的密码已成功重置，现在可以使用新密码登录。"
            extra={[
              <Button type="primary" key="login" onClick={() => navigate('/login')}>
                立即登录
              </Button>
            ]}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="reset-password">
      <Card className="reset-password-container">
        <img className="reset-password-logo" src={logo} alt="Logo" />
        <h2>重置密码</h2>
        
        {!tokenValid ? (
          <Result
            status="error"
            title="重置链接无效"
            subTitle={errorMsg}
            extra={[
              <Button type="primary" key="forgot" onClick={() => navigate('/forgot-password')}>
                重新获取重置链接
              </Button>,
              <Button key="login" onClick={() => navigate('/login')}>
                返回登录
              </Button>
            ]}
          />
        ) : (
          <Form form={form} onFinish={onFinish} validateTrigger="onBlur">
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入新密码',
                },
                {
                  min: 6,
                  message: '密码长度不能小于6个字符',
                },
              ]}
            >
              <Input.Password 
                size="large" 
                placeholder="请输入新密码" 
                prefix={<LockOutlined />} 
              />
            </Form.Item>
            
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: '请确认新密码',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password 
                size="large" 
                placeholder="请确认新密码" 
                prefix={<LockOutlined />} 
              />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block 
                loading={loading}
              >
                重置密码
              </Button>
            </Form.Item>
            
            <div className="form-links">
              <Link to="/login">返回登录</Link>
            </div>
          </Form>
        )}
      </Card>
    </div>
  )
}