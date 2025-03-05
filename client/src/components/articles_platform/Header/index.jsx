import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom"

import {
  SearchOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined,
  SettingOutlined,
  LayoutOutlined,
} from '@ant-design/icons';
import styles from './index.module.scss';


export function Header({ position }) {

  return (
    <div className={`${styles.header} ${position === 'sticky' ? 'sticky top-0' : 'static'}`} >
      <div className={styles.logo}>
        <img className={styles.logoSVG} src='/src/assets/articles_platform/article_logo.svg' alt=""></img>
        <span className={styles.logoCharacter}>Jay's Articles</span>
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
            <a href="#"><UserOutlined className={styles.icon} /></a>
          </li>
          <li className={styles.iconColorMode}>
            <a href="#"><MoonOutlined className={styles.icon} /></a>
          </li>
          <li className={styles.iconSettings}>
            <a href="#"><SettingOutlined className={styles.icon} /></a>
          </li>
          <li className={styles.iconLayout}>
            <a href="#"><LayoutOutlined className={styles.icon} /></a>
          </li>
        </ul>
      </div>
    </div>
  )
}