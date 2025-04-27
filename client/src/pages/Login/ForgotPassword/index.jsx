import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Form, Input, Button, message, Row, Col } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import logo from '/src/assets/react.svg'
import { forgotPasswordAPI } from '/src/apis/user'
import { getCaptchaAPI } from '/src/apis/articles_platform/captcha'
import './index.scss'

export default function ForgotPassword() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [captchaData, setCaptchaData] = useState('') 
  const [captchaKey, setCaptchaKey] = useState('') 
  const [emailSent, setEmailSent] = useState(false)

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

  const onFinish = async (values) => {
    try {
      setLoading(true)
      
      const submitData = {
        email: values.email,
        captchaKey,
        captchaText: values.captchaText
      }
      
      await forgotPasswordAPI(submitData)
      setEmailSent(true)
      message.success('如果该邮箱存在，我们已发送密码重置邮件')
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMsg = error.response.data.errors[0]
        message.error(errorMsg)
      } else {
        message.error('发送重置邮件失败')
      }
      // 刷新验证码
      fetchCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-password">
      <Card className="forgot-password-container">
        <img className="forgot-password-logo" src={logo} alt="Logo" />
        <h2>找回密码</h2>
        
        {emailSent ? (
          <div className="email-sent">
            <p>我们已向您的邮箱发送了重置密码链接，请查收。</p>
            <p>链接有效期为1小时，请及时重置密码。</p>
            <p>如果没有收到邮件，请检查垃圾邮件，或者<a onClick={() => {
              setEmailSent(false)
              fetchCaptcha()
              form.resetFields()
            }}>重新发送</a>。</p>
            <Button type="primary" size="large">
              <Link to="/login">返回登录</Link>
            </Button>
          </div>
        ) : (
          <Form form={form} onFinish={onFinish} validateTrigger="onBlur">
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: '请输入注册邮箱',
                },
                {
                  type: 'email',
                  message: '请输入有效的邮箱地址',
                },
              ]}
            >
              <Input 
                size="large" 
                placeholder="请输入注册邮箱" 
                prefix={<UserOutlined />} 
              />
            </Form.Item>
            
            <Form.Item
              name="captchaText"
              rules={[
                {
                  required: true,
                  message: '验证码不能为空',
                },
              ]}
            >
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
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block 
                loading={loading}
              >
                发送重置邮件
              </Button>
            </Form.Item>
            
            <div className="form-links">
              <Link to="/login">返回登录</Link>
              <Link to="/register">注册账号</Link>
            </div>
          </Form>
        )}
      </Card>
    </div>
  )
}