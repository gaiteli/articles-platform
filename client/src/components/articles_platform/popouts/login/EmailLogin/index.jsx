import { useState } from 'react';
import { Modal, Button, Form, Input, Divider } from 'antd';
import { GithubOutlined, GoogleOutlined, MailOutlined } from '@ant-design/icons';

import styles from './index.module.scss'

const EmailLogin = ({ onBack }) => (
  <Form layout="vertical">
    <Form.Item label="邮箱" name="email">
      <Input placeholder="your@email.com" />
    </Form.Item>
    <Form.Item label="密码" name="password">
      <Input.Password placeholder="………" />
    </Form.Item>
    <Form.Item label="验证码" name="captcha">
      <Input placeholder="输入验证码" />
    </Form.Item>
    <div className={styles.buttonArea}>
      <Button type="link" onClick={() => console.log('跳转到忘记密码页面')}>
        忘记密码？点击这里重置
      </Button>
      <Button type="primary" block>
        登录
      </Button>
      <Button type="link" onClick={() => console.log('跳转到注册页面')}>
        没有账号？注册
      </Button>
      <Button type="link" onClick={onBack}>
        返回使用快捷登录
      </Button>
    </div>
  </Form>
);

export default EmailLogin