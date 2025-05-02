import React, { useState, useEffect, useCallback } from 'react';
import CategorySelector from '../../widgets/CategorySelector';
import { getChannelByIdAPI } from "../../../../apis/articles_platform/channel";
import styles from './index.module.scss';


const PopoutChannelPage = ({ chosenCategory, onClose, onSubmit }) => {
  console.log('Initial chosenCategory:', chosenCategory);
  const [filters, setFilters] = useState({
    channel: null,
  });

  const handleFilterChange = (type, value) => {
    console.log('type+value:' + type + value);
    setFilters(prev => ({ ...prev, [type]: value }));
  };


  // 提交结果
  const handleSubmit = async () => {
    const channelId = Array.isArray(filters.channel)
      ? filters.channel[filters.channel.length - 1]
      : filters.channel
    const {data} = channelId ? await getChannelByIdAPI(channelId) : {data: null};

    if (data) {
      onSubmit(data); // 将选中的分类传递给父组件
      onClose(); // 关闭弹出页
    } else {
      if (chosenCategory) {
        onSubmit(chosenCategory); // 将选中的分类传递给父组件
        onClose(); // 关闭弹出页
      }
      else alert('请选择一个分类');
    }
  };


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

        <p className={styles.tip}>至多只能选一个分类哦</p>

        {/* 分类列表 */}
        <div className={styles.infiniteScrollContainer}>
          <CategorySelector
            isVisible={true}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
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