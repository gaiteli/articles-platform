import { useEffect, useRef, useState } from 'react';

import { Header } from '/src/components/articles_platform/Header'
import {
  List,
  Card,
  Flex,
  Typography,
  Space,
  Skeleton,
  Divider,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './index.module.scss'

import { getArticleListAPI } from '/src/apis/article'


const ArticlesPlatformListPage = () => {

  // 获取文章列表
  const [loading, setLoading] = useState(false);
  const [reqData, setReqData] = useState({
    currentPage: 1,
    pageSize: 10
  })
  const [count, setCount] = useState(0)
  const [list, setList] = useState([])

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true)
    const res = await getArticleListAPI(reqData)
    const newList = res.data.articles
    setList(prevList => [...prevList, ...newList])   // 追加数据
    console.log('list length: ' + list.length);
    setCount(res.data.pagination.total)
    setReqData(prevData => ({
      ...prevData,
      currentPage: prevData.currentPage + 1,    // 增加页码
    }));
    setLoading(false)
  }

  useEffect(() => {
    loadMoreData()
  }, [])

  return (
    <>
      <Header />
      <div className={styles.contentContainer}>
        <InfiniteScroll
          dataLength={list.length}
          next={loadMoreData}
          hasMore={list.length < count}
          loader={
            <div className={styles.loadingCard}>
              <Card className={styles.card}>
                <Skeleton.Image active style={{ width: '120px', height: '120px'}}/>
                <Skeleton
                  paragraph={{
                    rows: 2,
                  }}
                  active
                  style={{
                    padding: '7px 0px',
                    marginLeft: '60px'
                  }}
                />
              </Card>
            </div>

          }
          endMessage={<Divider plain>已经到底了 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            itemLayout='vertical'
            size='large'
            dataSource={list}
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
        </InfiniteScroll>
      </div>
    </>
  )
}

export default ArticlesPlatformListPage