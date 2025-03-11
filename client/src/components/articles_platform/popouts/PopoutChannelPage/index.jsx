import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Card, Skeleton, Divider, List } from 'antd';

import { getChannelsAPI } from '/src/apis/articles_platform/channel';
import { debounce } from '/src/utils';
import styles from './index.module.scss';


const PopoutChannelPage = ({ onClose, onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  // 获取分类列表
  const [categories, setCategories] = useState([])
  const [count, setCount] = useState(0)
  const [reqData, setReqData] = useState({
    name: null,
    currentPage: 1,
    pageSize: 10
  })

  // 获取文章分类信息
  const fetchCategories = async (keyword) => {

    const formData = {
      name: keyword,
      currentPage: 1,
      pageSize: 10
    }
    const res = await getChannelsAPI(formData);
    console.log(res);
    setCategories(res.data.channels)   // 追加数据

    setCount(res.data.pagination.total)
  }

  // 防抖处理后的搜索函数
  const debouncedFetchCategories = useCallback(
    debounce((keyword) => {
      fetchCategories(keyword);
    }, 500),
    []
  );

  // 用户输入触发搜索
  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    debouncedFetchCategories(keyword);
  }

  // 选择分类
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  // 提交结果
  const handleSubmit = () => {
    if (selectedCategory) {
      onSubmit(selectedCategory); // 将选中的分类传递给父组件
      onClose(); // 关闭弹出页
    } else {
      alert('请选择一个分类');
    }
  };

  // InfiniteScroll 加载更多数据函数
  const loadMoreData = async () => {
    const res = await getChannelsAPI(reqData);
    const newList = res.data.channels
    setCategories(prevList => [...prevList, ...newList])   // 追加数据
    setCount(res.data.pagination.total)
    setReqData(prevData => ({
      ...prevData,
      currentPage: prevData.currentPage + 1,    // 增加页码
    }));
  }

  return (
    <div className={styles.popout}>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.content}>
        {/* 关闭按钮 */}
        <button className={styles.closeButton} onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* 标题 */}
        <h2 className={styles.title}>选择分类</h2>

        {/* 搜索框 */}
        <input
          type="text"
          placeholder="搜索分类"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />

        {/* 提示信息 */}
        <p className={styles.tip}>至多只能选一个分类</p>

        {/* 分类列表 */}
        <div className={styles.infiniteScrollContainer}>
          <InfiniteScroll
            dataLength={categories.length}
            next={loadMoreData}
            hasMore={categories.length < count}
            loader={
              <div className={styles.loadingCard}>
                <Card className={styles.card}>
                  <Skeleton
                    paragraph={{
                      rows: 1,
                    }}
                    active
                    style={{
                      padding: '7px 0px',
                      marginLeft: '10px'
                    }}
                  />
                </Card>
              </div>
            }
            endMessage={searchTerm && (
              <Divider plain>已经到底了 🤐</Divider>
            )}
            scrollableTarget="scrollableDiv"
          >
            <List
              itemLayout='vertical'
              size='large'
              dataSource={categories}
              renderItem={(category, index) => (
                <List.Item style={{ borderBottom: 'none', padding: '7px 20px' }}>
                  <div className={styles.categoryListItem}>
                    <div className={styles.categoryInfo}>
                      <span className={styles.categoryName}>{category.name}</span>
                      <span className={styles.categoryCode}>{category.code}</span>
                    </div>
                    <button
                      className={styles.selectButton}
                      onClick={() => handleSelectCategory(category)}
                    >
                      {selectedCategory?.id === category.id ? '已选择' : '选择'}
                    </button>
                  </div>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>

        {/* 确定按钮 */}
        <button className={styles.submitButton} onClick={handleSubmit}>
          确定
        </button>
      </div>
    </div>
  );
};

export default PopoutChannelPage;

{/* <ul className={styles.categoryList}>
            {categories.map((category) => (
              <li
                key={category.id}
                className={`${styles.categoryItem} ${selectedCategory?.id === category.id ? styles.selected : ''
                  }`}
              >
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={styles.categoryCode}>{category.code}</span>
                </div>
                <button
                  className={styles.selectButton}
                  onClick={() => handleSelectCategory(category)}
                >
                  {selectedCategory?.id === category.id ? '已选择' : '选择'}
                </button>
              </li>
            ))}
          </ul> */}