import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Card, Result, Button, Spin, message, Form, Input } from 'antd'
import { verifyEmailAPI, resendVerificationAPI } from '/src/apis/user'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  // 从URL获取token参数
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')

  useEffect(() => {
    // 如果有token，则验证邮箱
    if (token) {
      verifyEmail(token)
    } else {
      setLoading(false)
      setError('无效的验证链接')
    }
  }, [token])

  // 验证邮箱
  const verifyEmail = async (token) => {
    try {
      const res = await verifyEmailAPI(token)
      setVerified(true)
      message.success(res.message || '账户激活成功！')
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || '验证失败')
      } else {
        setError('验证失败，请稍后再试')
      }
    } finally {
      setLoading(false)
    }
  }

  // 重新发送验证邮件
  const handleResendVerification = async (values) => {
    try {
      setLoading(true)
      const res = await resendVerificationAPI(values.email)
      message.success(res.message || '验证邮件已重新发送')
      setEmail('')
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || '发送失败')
      } else {
        message.error('发送失败，请稍后再试')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="verify-email" style={{ padding: '50px 0', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: 600 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 20 }}>正在验证，请稍后...</p>
          </div>
        ) : verified ? (
          <Result
            status="success"
            title="账户激活成功！"
            subTitle="您的账户已成功激活，现在可以登录使用所有功能。"
            extra={[
              <Button type="primary" key="login" onClick={() => navigate('/login')}>
                立即登录
              </Button>
            ]}
          />
        ) : (
          <Result
            status="error"
            title="验证失败"
            subTitle={error || '链接可能已过期或无效'}
            extra={[
              <div key="resend" style={{ textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
                <p>没有收到验证邮件？请输入您的注册邮箱重新发送：</p>
                <Form onFinish={handleResendVerification}>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: '请输入邮箱地址',
                      },
                      {
                        type: 'email',
                        message: '请输入有效的邮箱地址',
                      }
                    ]}
                  >
                    <Input placeholder="请输入注册时使用的邮箱" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      重新发送验证邮件
                    </Button>
                  </Form.Item>
                </Form>
                <Link to="/login">返回登录</Link>
              </div>
            ]}
          />
        )}
      </Card>
    </div>
  )
}