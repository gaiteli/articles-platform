import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { Modal, Button, Popconfirm, message } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  UserAddOutlined,
  SunOutlined,
  MoonOutlined,
  SettingOutlined,
  LayoutOutlined,
} from '@ant-design/icons';

import styles from './index.module.scss';
import { AuthContext } from '/src/store/AuthContext';
import { useTheme } from '/src/store/ThemeContext';
import LoginModal from '../popouts/login/LoginModal';
import { removeToken } from '/src/utils';


export function Header({ position }) {
  const { user, removeAuth } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const logoutConfirm = () => {
    removeToken()
    removeAuth()
  }

  return (
    <div className={`${styles.header} ${position === 'sticky' ? 'sticky top-0' : 'static'}`} >
      <div className={styles.logo}>
        <img className={styles.logoSVG} src='/src/assets/articles_platform/article_logo.svg' alt=""></img>
        <span className={styles.logoCharacter}>JetArticles</span>
      </div>
      <div className={styles.menu}>
        <ul className={styles.menuList}>
          <li>
            <Link to={'/articles'} className={styles.menuLink}>
              <i></i>
              <span>首页</span>
            </Link>
          </li>
          <li>
            <Link to={'/articles/list'} className={styles.menuLink}>
              <i></i>
              <span>文章</span>
            </Link>
          </li>
          <li>
            <Link to={'/articles/write'} className={styles.menuLink}>
              <i></i>
              <span>写作</span>
            </Link>
          </li>
        </ul>
        <form action="" className={styles.searchForm}>
          <div className={styles.searchBoxContainer}>
            <button className={`${styles.searchBtn} iconfont icon-sousuo`}></button>
            <input type="search" className={styles.searchBox} placeholder='搜索' />
          </div>
        </form>
      </div>
      <div className={styles.icons}>
        <ul className={styles.iconsList}>
          <li className={styles.iconUser}>
            {user.username ? (
              <div className={styles.userInfo}>
                <Popconfirm
                  title="确定登出吗？"
                  onConfirm={logoutConfirm}
                  okText="确定"
                  cancelText="取消"
                >
                  <span>{user.username}</span>
                  <UserOutlined className={styles.icon} />
                </Popconfirm>
              </div>
            ) : (
              <a onClick={() => setIsLoginModalOpen(true)}>
                <UserAddOutlined className={styles.icon} />
              </a>
            )}
          </li>
          <li className={styles.iconColorMode}>
            <a onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoonOutlined className={styles.icon} />
            </a>
          </li>
          <li className={styles.iconSettings}>
            <a onClick={() => navigate('/articles/settings')}>
              <SettingOutlined className={styles.icon} />
            </a>
          </li>
          <li className={styles.iconLayout}>
            <a onClick={() => message.warning('尚在开发中，敬请期待...')}><LayoutOutlined className={styles.icon} /></a>
          </li>
        </ul>
      </div>

      {/* 登录注册弹窗 */}
      <LoginModal
        visible={isLoginModalOpen}
        onCancel={() => setIsLoginModalOpen(false)}
      />
    </div>
  )
}