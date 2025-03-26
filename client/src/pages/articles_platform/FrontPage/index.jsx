import { useEffect, useRef, useState, useContext } from 'react';
import { List, Card, Typography, Spin } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons'

import styles from './index.module.scss'
import { Header } from '/src/components/articles_platform/Header'
import Footer from '/src/components/articles_platform/Footer';
import { debounce } from '../../../utils/index.js';
import { getRecentArticlesAPI, getPopularArticlesAPI } from '/src/apis/articles_platform/article';
import SmallArticleList from '../../../components/articles_platform/pageComponents/frontPage/SmallArticleList/index.jsx';
import { AuthContext } from '/src/store/AuthContext';
const { Title, Text } = Typography;


const ArticlesPlatformFrontPage = () => {
  const { user } = useContext(AuthContext)
  const eleRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(true)
  const [recentArticles, setRecentArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [loading, setLoading] = useState(false);


  // 获取最近文章
  const fetchRecentArticles = async () => {
    setLoading(true)
    try {
      const res = await getRecentArticlesAPI({ limit: 6 })    // 获取最新5篇文章
      setRecentArticles(res.data.articles)
    } catch (error) {
      console.error('获取最新文章失败:', error)
    } finally {
      setLoading(false)
    }
  };

  // 获取最热门文章
  const fetchPopularArticles = async () => {
    setLoading(true);
    try {
      const res = await getPopularArticlesAPI({ limit: 6 })  // 获取最热5篇文章
      setPopularArticles(res.data.articles);
    } catch (error) {
      console.error('获取最热门文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentArticles();
    fetchPopularArticles();
  }, []);


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
    console.log(eleRef.current.src);
    document.body.addEventListener('mousemove', debounce(scrollListener, 500))

    return () => {
      document.body.removeEventListener('mousemove', debounce(scrollListener, 500));
    };
  }, []);


  return (
    <>
      <Header position="sticky" />
      <div className={styles.welcomeContainer}>
        <img
          className={styles.backgroundImage}
          ref={eleRef}
          // src="/src/assets/articles_platform/home_pic.jpg"
          src={user.bgImageUrl || "/src/assets/articles_platform/home_pic.png"}
        />
        <div className={styles.titles}>
          <h1>GatesLee's study</h1>
          <h4>One man's soliloquize</h4>
        </div>
        <div
          id={styles.scrollDownPrompt}
          className="text-white animate-bounce text-6xl"
          onClick={scrollToBottom}
        >
          {showScrollBottom ? <CaretDownOutlined /> : null}
        </div>
      </div>
      <main className={styles.mainContainer}>
        <Spin spinning={loading}>
          <section className={styles.recentAndPopularSec}>
            {/* 最近文章 */}
            <section className={styles.section}>
              <Title level={2}>最近文章</Title>
              <SmallArticleList articles={recentArticles} />
            </section>

            {/* 最热文章 */}
            <section className={styles.section}>
              <Title level={2}>最热门文章</Title>
              <SmallArticleList articles={popularArticles} />
            </section>
          </section>

          {/* 推荐 */}
          <section className={styles.recommendationSection}>
            <section className={styles.section}>
              <Title level={2}>推荐</Title>
              <Card>
                <Text type="secondary">正在开发中...</Text>
              </Card>
            </section>
          </section>
        </Spin>
      </main>
      <Footer />
    </>
  )
}

export default ArticlesPlatformFrontPage