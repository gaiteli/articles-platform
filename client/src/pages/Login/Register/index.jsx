import React from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import { Card, Form, Input, Button, message } from 'antd'
import logo from '/src/assets/react.svg'
import { registerAPI } from '/src/apis/user' 


export default function Register() {
  const navigate = useNavigate()

  const onFinish = async (values) => {

    // const res = await myFetch('http://localhost:9000/register', values)
    const res = await registerAPI(values)
    const data = res
    console.log('拿到的token:' + data.token);

    // 跳转到注册页
    navigate('/signin')
    message.success('注册成功')
  }

  return (
    <div className="register">
      <Card className="register-container">
        <img className="register-logo" src={logo} alt="" />
        {/* 注册表单 */}
        {/* 增加失焦时校验 */}
        <Form 
          validateTrigger="onBlur" 
          onFinish={onFinish}
          initialValues={{
            remember: true,
          }}
          className='register-form'
        >
          <div className='ant-form-item-wrap'><Form.Item
            name="username"
            className="necessary-field"
            rules={[
              {
                required: true,
                message: '用户名不能为空',
              }
            ]}>
            <Input size="large" placeholder="请输入用户名" className="antd-input"/>
          </Form.Item></div>
          <div className='ant-form-item-wrap'><Form.Item
            name="account"
            className="necessary-field"
            rules={[
              {
                required: true,
                message: '账户名不能为空',
              }
            ]}>
            <Input size="large" placeholder="请输入账户名" className="antd-input"/>
          </Form.Item></div>
          <div className='ant-form-item-wrap'><Form.Item
            name="mobile"
            rules={[  
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入正确的手机号格式',
              },
            ]}>
            <Input size="large" placeholder="请输入手机号" className="antd-input"/>
          </Form.Item></div>
          <div className='ant-form-item-wrap'><Form.Item
            name="password"
            className="necessary-field"
            rules={[
              {
                required: true,
                message: '密码不能为空',
              },
              {
                min: 6,
                message: '密码长度不能小于6个字符',
              }
            ]}>
            <Input.Password size="large" placeholder="请输入密码" className="antd-input"/>
          </Form.Item></div>
          <div className='ant-form-item-wrap'><Form.Item
            className="necessary-field"
            rules={[
              {
                required: true,
                message: '确认密码不能为空',
              },
              {   // 确认密码的验证函数
                validator: (rule, value, callback) => {
                  const form = props.form;
                  if (value && value !== form.getFieldValue('password')) {
                    callback('两次输入的密码不一致！请重新确认')
                  } else {
                    callback()
                  }
                }
              }
            ]}>
            <Input.Password size="large" placeholder="请确认密码" className="antd-input"/>
          </Form.Item></div>
          {/* <Form.Item
            name="code"
            rules={[
              {
                required: true,
                message: '请输入验证码',
              },
            ]}>
            <Input size="large" placeholder="请输入验证码" className="antd-input"/>
          </Form.Item> */}

          <Form.Item className='register-btn'>
            <Button type="primary" htmlType="submit" size="large" block>
              注册
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}