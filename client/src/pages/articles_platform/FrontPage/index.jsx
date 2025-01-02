import { useEffect, useRef } from 'react';

import { Header } from '/src/components/articles_platform/Header'
import { List, Card, Flex, Typography } from 'antd';
import styles from './index.module.scss'

const ArticlesPlatformFrontPage = () => {
  

  return (
    <>
      <Header />
      <div className={styles.contentContainer}>
        <img className={styles.backgroundImage}
          src="/src/assets/articles_platform/home_pic.jpg"
        />
        <div className={styles.content}>
            <h1>GatesLee's study</h1>
            <h4>One man's soliloquize</h4>
        </div>
        <div className={styles.mask}></div>
      </div>
    </>
  )
}

export default ArticlesPlatformFrontPage