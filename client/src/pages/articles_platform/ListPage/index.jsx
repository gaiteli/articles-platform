import { useEffect, useRef, useState } from 'react';

import { Header } from '/src/components/articles_platform/Header'
import { List, Card, Flex, Typography, Space } from 'antd';
import styles from './index.module.scss'

import { getArticleListAPI } from '/src/apis/article'


const ArticlesPlatformListPage = () => {

  const [loading, setLoading] = useState(false);

  // 获取文章列表
  const [reqData, setReqData] = useState({
    currentPage: 1,
    pageSize: 10
  })
  const [count, setCount] = useState(0)
  const [list, setList] = useState([])

  useEffect(() => {
    (async () => {
      const res = await getArticleListAPI(reqData)
      const list = res.data.articles
      setList(list)
      setCount(res.data.pagination.total)
    })()
  }, [reqData])

  const onPageChange = (currentPage, pageSize) => {
    console.log('page change to: ' + currentPage + 'page size change to: ' + pageSize)
    setReqData({
      ...reqData,
      currentPage,
      pageSize
    })
  }

  return (
    <>
      <Header />
      <div className={styles.contentContainer}>
        <List
          itemLayout='vertical'
          size='large'
          pagination={{ position: 'bottom', align: 'center', total: count, 
            onChange: onPageChange
          }}
          dataSource={list}
          className='articles-list'
          renderItem={(item, index) => (
            <List.Item style={{ borderBottom: 'none', padding: '7px 20px' }}>
              <Card
                // hoverable
                className={styles.card}

              >
                <img
                  alt="avatar"
                  src="/src/assets/articles_platform/picture_loading_failure.svg"
                  className={styles.articlePic}
                  style={{    // 为啥移到scss中就无法应用了
                    display: 'block',
                    width: '7.5rem',
                  }}
                />
                <div className={styles.articleInfo}>
                  <Typography.Title level={4}>
                    {item.title}
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    {item.createdAt}
                  </Typography.Text>
                  <Typography.Text style={{ display: 'block' }}>
                    {item.content}
                  </Typography.Text>
                </div>
              </Card>
            </List.Item>
          )}

        />
      </div>
    </>
  )
}

export default ArticlesPlatformListPage