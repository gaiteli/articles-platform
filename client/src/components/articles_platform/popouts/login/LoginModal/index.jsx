import { useState } from 'react';
import { Modal } from 'antd';

import styles from './index.module.scss'
import EmailLogin from '../EmailLogin';
import QuickLogin from '../QuickLogin';

const LoginModal = ({ visible, onCancel }) => {
  const [isEmailLogin, setIsEmailLogin] = useState(false);

  if (!visible) return null;    // 如果模态框不可见，不渲染任何内容

  return (
    <>
      {/* 背景虚化遮罩层 */}
      <div className={styles.modalBackdrop} onClick={onCancel} />

      <Modal
        title="登录到 JetArticles"
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={400}
      >
        <div className={styles.modalContent}>
          {isEmailLogin ? (
            // 邮箱登录表单
            <EmailLogin onBack={() => setIsEmailLogin(false)} />
          ) : (
            // 快捷登录界面
            <QuickLogin onEmailLogin={() => setIsEmailLogin(true)} />
          )}
        </div>
      </Modal>
    </>

  );
};

export default LoginModal