import React from 'react';
import { Link } from 'react-router-dom';

import styles from './index.module.scss';
import { GithubOutlined } from '@ant-design/icons';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <div className={styles.linkGroup}>
          <span>Github Page： </span>
          <a href="https://github.com/gaiteli" target="_blank" rel="noopener noreferrer"><GithubOutlined /></a>
        </div>
      </div>
      <div className={styles.copyright}>
        © 2025 Jetli. All rights reserved.
      </div>
      <div className={styles.record}>
        <a href="http://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
          蜀ICP备2025128812号-1
        </a>
      </div>
    </footer>
  );
};

export default Footer;