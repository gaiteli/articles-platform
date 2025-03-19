import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './index.scss'
import { Card, Form, Input, Button, message } from 'antd'
import logo from '/src/assets/react.svg'
import { registerAPI } from '/src/apis/user' 


export default function Register(props) {
  const navigate = useNavigate()

  const [form] = Form.useForm()   // 获取Form表单实例，以实现确认密码功能 ！记得在Form中关联form
  //窗口显示时，对form进行赋值；否则调用Form.useForm()方法时Form element还未初始化，会报错
  // https://blog.csdn.net/weixin_44944640/article/details/122258717
  // useEffect(() => {
  //   if(props.visible){
  //     form.setFieldsValue(props.record);
  //   }
  // }, [props.visible]);

  const onFinish = async (values) => {
    const res = await registerAPI(values)
    navigate('/login')   // 跳转到登录页
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
          className='register-form'
          form={form}   // 使用form属性将form对象与Form组件进行关联
        >
          <Form.Item
            name="username"
            className="required"
            rules={[
              {
                required: true,
                message: '用户名不能为空',
              }
            ]}>
            <Input size="large" placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="account"
            className="required"
            rules={[
              {
                required: true,
                message: '账户名不能为空',
              }
            ]}>
            <Input size="large" placeholder="请输入账户名" />
          </Form.Item>
          <Form.Item
            name="mobile"
            rules={[  
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入正确的手机号格式',
              },
            ]}>
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="password"
            className="required"
            rules={[
              {
                required: true,
                message: '密码不能为空',
              },
              {
                min: 6,
                message: '密码长度至少6位',
              }
            ]}>
            <Input.Password size="large" placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            className="required"
            dependencies={['password']} // 确保确认密码依赖密码字段
            rules={[
              {
                required: true,
                message: '确认密码不能为空',
              },
              {   // 确认密码的验证函数
                validator: async (rule, value) => {
                  console.log(form.getFieldValue('password'));
                  if (value && value !== form.getFieldValue('password')) {
                    return Promise.reject('密码不一致！请重新确认');
                  } 
                  return Promise.resolve();
                }
              }
            ]}>
            <Input.Password size="large" placeholder="请确认密码" />
          </Form.Item>
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
          <Link to="/login">已有账号？去登录</Link>
        </Form>
      </Card>
    </div>
  )
}