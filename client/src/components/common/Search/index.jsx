// SearchComponent.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { message } from 'antd';
import {
  SearchOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

import styles from './index.module.scss';
import { searchArticlesAPI } from '/src/apis/articles_platform/search';

const SearchComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchRef = useRef(null);
  const searchResultsRef = useRef(null);

  // 点击弹窗外关闭搜索结果
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target) &&
        searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 改变路由清除搜索
  useEffect(() => {
    setSearchTerm('');
    setShowSearchResults(false);
  }, [location.pathname]);

  // Debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim().length >= 1) {
        performSearch();
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const performSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const response = await searchArticlesAPI({
        q: searchTerm,
        pageSize: 5,
        currentPage: 1,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (response && response.data.articles) {
        setSearchResults(response.data.articles);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('搜索错误:', error);
      message.error('搜索失败，请稍后重试');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/articles/list?search=${encodeURIComponent(searchTerm)}`);
      setShowSearchResults(false);
    }
  };

  const navigateToArticle = (articleId) => {
    navigate(`/articles/${articleId}`);
    setShowSearchResults(false);
    setSearchTerm('');
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // 判断是否应该展开搜索框
  const isExpanded = isInputFocused || searchTerm.length > 0;

  return (
    <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
      <div ref={searchRef} className={`${styles.searchBoxContainer} ${isExpanded ? styles.expanded : ''}`}>
        <button className={`${styles.searchBtn} iconfont icon-sousuo`}></button>
        <input
          className={styles.searchBox}
          placeholder='搜索文章'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            setIsInputFocused(true); // 设置焦点状态
            // 如果已有搜索词，聚焦时显示结果
            if (searchTerm.trim() && searchResults.length > 0) {
              setShowSearchResults(true);
            }
          }}
          onBlur={() => {
            setIsInputFocused(false);
            // 注意：不要在 onBlur 中立即隐藏结果. handleClickOutside 会处理点击外部区域关闭结果。
          }}
        />
        {isSearching && <LoadingOutlined />}
        {searchTerm && (
          <CloseCircleOutlined
            className={styles.clearSearchBtn}
            onClick={clearSearch}
          />
        )}

        {showSearchResults && searchResults.length > 0 && (
          <div ref={searchResultsRef} className={styles.searchResults}>
            <ul>
              {searchResults.map(article => (
                <li key={article.id} onClick={() => navigateToArticle(article.id)}>
                  <div className={styles.resultTitle}>{article.title}</div>
                  <div className={styles.resultMeta}>
                    <span>{article.channelName}</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
              <li className={styles.viewAllResults} onClick={handleSearchSubmit}>
                查看全部搜索结果
              </li>
            </ul>
            <span className={styles.meiliAds}>搜索引擎 MeiliSearch 为您服务中</span>
          </div>
        )}

        {showSearchResults && searchTerm && searchResults.length === 0 && !isSearching && (
          <div ref={searchResultsRef} className={styles.searchResults}>
            <div className={styles.noResults}>
              没有找到相关文章
            </div>
            <span className={styles.meiliAds}>搜索引擎 MeiliSearch 为您服务中</span>
          </div>
        )}
        
      </div>
    </form>
  );
};

export default SearchComponent;