import { useEffect, useRef, useState } from 'react';

import { Header } from '/src/components/articles_platform/Header'
import {
  List,
  Button,
  Card,
  Flex,
  Typography,
  Space,
  Skeleton,
  Divider,
} from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CSSTransition } from 'react-transition-group';
import styles from './index.module.scss'

import { getArticleListAPI } from '/src/apis/article'


const ArticlesPlatformListPage = () => {

  // 控制副栏是否显示
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleLayout = () => {
    setIsSidebarVisible(!isSidebarVisible); // 切换时关闭副栏
  };


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
      <div className={styles.container}>
        <div className={styles.mainColumnContainer}>
          <InfiniteScroll
            dataLength={list.length}
            next={loadMoreData}
            hasMore={list.length < count}
            loader={
              <div className={styles.loadingCard}>
                <Card className={styles.card}>
                  <Skeleton.Image active style={{ width: '120px', height: '120px' }} />
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
        {/* <Button
            type="primary"
            shape="circle"
            icon={isSidebarVisible ? <LeftOutlined /> : <RightOutlined />}
            onClick={toggleLayout}
            className="fixed right-1 transform -translate-y-1/2 translate-x-1/2"
          /> */}
        <button
          onClick={toggleLayout}
          id={styles.toggleButton}
          className="-translate-y-1/2 translate-x-1/2 bg-transparent border-none focus:outline-none "
        >
          <div
            style={{
              transform: isSidebarVisible ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            <RightOutlined />
          </div>
        </button>
        <CSSTransition
          in={isSidebarVisible} // {/* 直接赋值为true貌似不影响 */}
          timeout={300}
          classNames={{
            enter: styles.sidebarEnter,
            enterActive: styles.sidebarEnterActive,
            enterDone: styles.sidebarEnterDone,
            exit: styles.sidebarExit,
            exitActive: styles.sidebarExitActive,
            exitDone: styles.sidebarExitDone,
          }}
          unmountOnExit
        >
          <div className={styles.sidebar}>
            <Card title="其他信息" bordered>
              <p>这里是副栏内容...</p>
            </Card>
          </div>
        </CSSTransition>
      </div>

    </>
  )
}

export default ArticlesPlatformListPage