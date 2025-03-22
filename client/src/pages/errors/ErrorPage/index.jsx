import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.scss'

const ErrorPage = ({ code, type, message }) => {
  const navigate = useNavigate()

  return (
    <div className={styles.errorContainer}>
      <div>
        <h1>{code}</h1>
        <h4>{type}</h4>
        <p>{message}</p>
      </div>
      <button
        className={styles.button}
        onClick={() => navigate('/articles/list')}
      >
        返回文章列表
      </button>
      <button
        className={styles.button}
        onClick={() => navigate('/articles')}
      >
        返回首页
      </button>
    </div>
  );
};

export default ErrorPage;