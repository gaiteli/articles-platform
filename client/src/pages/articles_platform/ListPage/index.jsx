import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CSSTransition } from 'react-transition-group';
import moment from 'moment';
import {
  List, Button, Card, Flex, Typography, Space, Skeleton, Divider, Tag,
  DatePicker, Cascader, Select, Radio, message
} from 'antd';
import {
  RightOutlined, LeftOutlined, ClockCircleFilled, ClockCircleOutlined,
  HistoryOutlined, FolderOpenFilled, EyeOutlined, LikeOutlined
} from '@ant-design/icons';

import { Header } from '/src/components/articles_platform/Header'
import styles from './index.module.scss'
import { getArticleListAPI } from '/src/apis/articles_platform/article'
import { getNestedChannelsAPI } from '/src/apis/articles_platform/channel';

const { RangePicker } = DatePicker;
import locale from 'antd/es/date-picker/locale/zh_CN' // 引入汉化包 时间选择器显示中文
const { Option } = Select;

const ArticlesPlatformListPage = () => {
  moment.locale('zh-cn');
  const navigate = useNavigate()

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reqData, setReqData] = useState({
    currentPage: 1,
    pageSize: 10
  })
  const [count, setCount] = useState(0)
  const [list, setList] = useState([])
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);


  // 基于分类进行筛选/排序
  const [filters, setFilters] = useState({
    timeRange: null,
    channel: null,
    sortBy: 'createdAt',
  });

  // 获取分类数据
  const fetchCategories = async () => {
    if (categories.length > 0 || categoriesLoading) return;

    setCategoriesLoading(true);
    try {
      const res = await getNestedChannelsAPI();
      setCategories(res.data);
    } catch (error) {
      message.error('获取分类失败');
    } finally {
      setCategoriesLoading(false);
    }
  };

  // 切换侧边栏时获取分类
  const toggleLayout = async () => {
    setIsSidebarVisible(!isSidebarVisible);
    if (!isSidebarVisible && categories.length === 0) {
      await fetchCategories();
    }
  };


  // 文章加载
  const loadMoreData = async () => {
    if (loading) return

    setLoading(true)
    try {
      const params = {
        ...reqData,
        startTime: filters.timeRange?.[0]?.format('YYYY-MM-DD'),
        endTime: filters.timeRange?.[1]?.format('YYYY-MM-DD'),
        channelId: filters.channel,
        sortBy: filters.sortBy,
      };

      const res = await getArticleListAPI(params);
      const newList = res.data.articles;

      setList(prevList => [...prevList, ...newList])   // 追加数据
      setCount(res.data.pagination.total);
      setReqData(prev => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    } finally {
      setLoading(false);
    }
  }

  // 筛选变化处理
  const handleFilterChange = (type, value) => {
    console.log('type+value:' + type + value);
    setFilters(prev => ({ ...prev, [type]: value }));
    setReqData(prev => ({ ...prev, currentPage: 1 }));
    setList([]);
  };


  // 点击文章item跳转到文章详情页
  const handleClickArticlesListItem = (id) => {
    navigate(`/articles/${id}`)
  }

  useEffect(() => {
    loadMoreData()
  }, [filters]); // 当筛选条件变化时重新加载

  return (
    <>
      <Header position="sticky" />
      <div className={styles.container}>
        {/* 文章列表主体 */}
        <div className={styles.mainColumnContainer} data-visible={isSidebarVisible}>
          <InfiniteScroll
            dataLength={list.length}
            next={loadMoreData}
            hasMore={list.length < count}
            loader={
              <div className={styles.loadingCard}>
                <Card className={styles.card}>
                  <Skeleton.Image     // 待加载用骨架屏
                    active
                    style={{ width: '120px', height: '120px' }}
                  />
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
                <List.Item
                  style={{ borderBottom: 'none', padding: '7px 20px' }}
                >
                  <Card
                    // hoverable
                    className={styles.card}
                  >
                    <div className={styles.coverContainer}>
                      <img
                        src={item.cover || "/src/assets/articles_platform/no_picture_available.svg"}
                        alt="cover"
                        className={styles.articleCover}
                        onError={(e) =>
                          e.target.src = "/src/assets/articles_platform/no_picture_available.svg"}
                      />
                    </div>
                    <div
                      className={styles.articleInfo}
                      onClick={() => handleClickArticlesListItem(item.id)}
                    >
                      <Typography.Title level={4}>
                        {item.title}
                      </Typography.Title>
                      <Typography.Text type="secondary" className={styles.articleMeta}>
                        <HistoryOutlined />
                        <span style={{ marginLeft: '0.25rem', marginRight: '2rem' }}>
                          {' ' + moment(item.createdAt).format('ll')}
                        </span>
                        <FolderOpenFilled />
                        <span style={{ marginLeft: '0.25rem', marginRight: '2rem' }}>
                          {' ' + item.channelName}
                        </span>
                        <EyeOutlined />
                        <span style={{ marginLeft: '0.25rem', marginRight: '2rem' }}>
                          {' ' + item.readCount}
                        </span>
                        <LikeOutlined />
                        <span style={{ marginLeft: '0.25rem', marginRight: '2rem' }}>
                          {' ' + item.likeCount}
                        </span>
                        {item.status === 0 && <Tag color="orange">审核中</Tag>}
                        {item.status === 2 && <Tag color="red">已锁定</Tag>}
                      </Typography.Text>
                      <div className={styles.articleContent}>
                        {item.content.replace(/<[^>]+>/g, '')}
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}

            />
          </InfiniteScroll>
        </div>

        {/* 侧边栏内容 */}
        <aside id={styles.asideContainer} data-visible={isSidebarVisible}>
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
              <Card title="筛选和排序" bordered>
                {/* 排序方式 */}
                <div className={styles.filterSection}>
                  <Typography.Text strong>排序方式</Typography.Text>
                  <Radio.Group
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    block
                  >
                    <Radio.Button value="createdAt">最新</Radio.Button>
                    <Radio.Button value="readCount">阅读量</Radio.Button>
                    <Radio.Button value="likeCount">点赞数</Radio.Button>
                  </Radio.Group>
                </div>

                {/* 时间范围 */}
                <div className={styles.filterSection}>
                  <Typography.Text strong>发布时间</Typography.Text>
                  <RangePicker
                    locale={locale}
                    style={{ width: '100%' }}
                    value={filters.timeRange}
                    onChange={(dates) => handleFilterChange('timeRange', dates)}
                  />
                </div>

                {/* 分类筛选 */}
                <div className={styles.filterSection}>
                  <Typography.Text strong>文章分类</Typography.Text>
                  <Cascader
                    options={categories}
                    loading={categoriesLoading}
                    value={filters.channel ? [filters.channel] : []}
                    onChange={(value) => {
                      const selectedValue = value?.length > 0 ? value[value.length - 1] : null;
                      handleFilterChange('channel', selectedValue);
                    }}
                    placeholder={categoriesLoading ? '加载中请稍后..' : '选择分类'}
                    displayRender={labels => labels[labels.length - 1]}
                    expandTrigger="hover"
                    changeOnSelect
                    showSearch={{
                      filter: (inputValue, path) =>
                        path.some(option =>
                          option.label.toLowerCase().includes(inputValue.toLowerCase())
                        )
                    }}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* 清除筛选 */}
                <Button
                  type="link"
                  danger
                  onClick={() => {
                    setFilters({
                      timeRange: null,
                      channel: null,
                      sortBy: 'createdAt',
                    });
                  }}
                  style={{ marginTop: 16, width: '100%' }}
                >
                  清除所有筛选
                </Button>

                <Divider />
                
                {/* 热门标签 */}
                <div className={styles.filterSection}>
                  <Typography.Text strong>热门标签</Typography.Text>
                  <Space size={[8, 8]} wrap>
                    <Tag color="magenta">React</Tag>
                    <Tag color="red">前端开发</Tag>
                    <Tag color="volcano">JavaScript</Tag>
                    <Tag color="orange">算法</Tag>
                  </Space>
                </div>

              </Card>
            </div>
          </CSSTransition>
        </aside>

        {/* 侧边栏切换按钮 */}
        <button
          onClick={toggleLayout}
          id={styles.toggleButton}
          className="-translate-y-1/2 translate-x-1/2 border-none focus:outline-none "
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

      </div>
    </>
  )
}

export default ArticlesPlatformListPage