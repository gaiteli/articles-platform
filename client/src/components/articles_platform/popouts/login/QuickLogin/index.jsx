import { useState } from 'react';
import { Modal, Button, Form, Input, Divider, message } from 'antd';
import { GithubOutlined, GoogleOutlined, MailOutlined } from '@ant-design/icons';

import styles from './index.module.scss'
import { useNavigate } from 'react-router-dom';

const QuickLogin = ({ onEmailLogin }) => {
  const navigate = useNavigate()

  return (
    <div className={styles.quickLogin}>
      <p className={styles.welcomeText}>欢迎回来！请登录您的账号</p>
      <Button
        type="primary"
        icon={<MailOutlined />}
        block
        // onClick={onEmailLogin}
        onClick={() => navigate('/login')}
      >
        通过邮箱登录
      </Button>
      <Divider plain>或通过社交账号登录</Divider>
      <div className={styles.socialLogin}>
        <Button
          icon={<GithubOutlined />}
          block
          onClick={() => message.warning('正在开发中，敬请期待！')}
        >
          GitHub
        </Button>
        <Button
          icon={<GoogleOutlined />}
          block
          onClick={() => message.warning('正在开发中，敬请期待！')}
        >
          Google
        </Button>
      </div>
    </div>
  );
}

export default QuickLogin