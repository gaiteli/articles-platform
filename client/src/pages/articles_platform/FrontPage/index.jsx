import { useEffect, useRef, useState } from 'react';

import { Header } from '/src/components/articles_platform/Header'
import { List, Card, Flex, Typography } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons'
import styles from './index.module.scss'
import {debounce} from '../../../utils/index.js';

const ArticlesPlatformFrontPage = () => {
  const eleRef = useRef(null); // 使用 ref 来访问 DOM 元素
  const [showScrollBottom, setShowScrollBottom] = useState(true)

  // 定义 scrollToBottom 函数
  const scrollToBottom = () => {
    if (eleRef.current) {
      window.scrollTo({
        top: eleRef.current.clientHeight, // 使用 offsetTop 获取元素的顶部位置
        behavior: 'smooth',
      });
    }
  };

  const scrollListener = () => {
    if (document.body.scrollTop > 50) {
      setShowScrollBottom(false)
    } else {
      setShowScrollBottom(true)
    }
  };

  useEffect(() => {
    // 在组件挂载时执行某些操作（可选）
    console.log(eleRef.current);
    document.body.addEventListener('mousemove', debounce(scrollListener, 500))
  }, []);

  

  return (
    <>
      <Header position="sticky" />
      <div className={styles.welcomeContainer}>
        <img className={styles.backgroundImage} ref={eleRef}
          src="/src/assets/articles_platform/home_pic.jpg"
        />
        <div className={styles.titles}>
          <h1>GatesLee's study</h1>
          <h4>One man's soliloquize</h4>
        </div>
        <div id={styles.scrollDownPrompt} className="text-white animate-bounce"
          onClick={scrollToBottom}>
          {showScrollBottom ? <CaretDownOutlined /> : null}
        </div>
      </div>
      <div className={styles.content}>
        <h1>dfdffd</h1>
      </div>
    </>
  )
}

export default ArticlesPlatformFrontPage