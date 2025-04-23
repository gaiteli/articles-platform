import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import { 
  getPublicTagsAPI, 
  getUserTagsAPI, 
  createTagAPI, 
  setArticleTagsAPI,
  submitTagReviewAPI
} from '/src/apis/articles_platform/tag'

const TagSelector = ({ 
  articleId, 
  initialTags = [], 
  onTagsChange,
  isEditMode = true 
}) => {
  const [tags, setTags] = useState(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [publicTags, setPublicTags] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'public', 'private'
  const inputRef = useRef(null);
  
  // 获取标签建议
  useEffect(() => {
    if (isEditMode) {
      fetchTags();
    }
  }, [isEditMode]);
  
  const fetchTags = async () => {
    try {
      setIsLoading(true);
      // 获取公共标签
      const publicResponse = await getPublicTagsAPI({ limit: 50 });
      
      // 获取用户标签
      const userResponse = await getUserTagsAPI();
      
      setPublicTags(publicResponse.data.tags || []);
      setUserTags(userResponse.data.tags || []);
      
      // 合并所有标签作为建议
      setSuggestions([...publicResponse.tags, ...userResponse.tags]);
      setIsLoading(false);
    } catch (error) {
      console.error('获取标签失败:', error);
      setIsLoading(false);
    }
  };
  
  // 当输入值变化时过滤建议
  useEffect(() => {
    if (inputValue.trim() === '') {
      // 显示所有标签作为建议
      const allTags = [...publicTags, ...userTags];
      // 过滤掉已选择的标签
      const filteredSuggestions = allTags.filter(
        tag => !tags.some(t => t.id === tag.id)
      );
      setSuggestions(filteredSuggestions);
      return;
    }
    
    const value = inputValue.toLowerCase().trim();
    let filtered = [];
    
    // 根据当前激活的标签页筛选
    if (activeTab === 'all' || activeTab === 'public') {
      const filteredPublic = publicTags.filter(
        tag => tag.name.toLowerCase().includes(value) && 
        !tags.some(t => t.id === tag.id)
      );
      filtered = [...filtered, ...filteredPublic];
    }
    
    if (activeTab === 'all' || activeTab === 'private') {
      const filteredUser = userTags.filter(
        tag => tag.name.toLowerCase().includes(value) && 
        !tags.some(t => t.id === tag.id)
      );
      filtered = [...filtered, ...filteredUser];
    }
    
    setSuggestions(filtered);
  }, [inputValue, tags, activeTab, publicTags, userTags]);
  
  // 添加标签
  const addTag = async (tag) => {
    // 检查是否已经添加过该标签
    if (tags.some(t => t.id === tag.id)) {
      return;
    }
    
    const updatedTags = [...tags, tag];
    setTags(updatedTags);
    
    // 如果已关联文章，则向后端发送请求
    if (articleId) {
      try {
        // 注意：这里需要发送所有标签ID，而不只是新标签
        const tagIds = [...tags.map(t => t.id), tag.id];
        
        await setArticleTagsAPI(articleId, { tagIds });
      } catch (error) {
        console.error('添加标签失败:', error);
      }
    }
    
    // 清空输入并关闭下拉菜单
    setInputValue('');
    setShowDropdown(false);
    
    // 通知父组件标签变化
    if (onTagsChange) {
      onTagsChange(updatedTags);
    }
  };
  
  // 创建新标签
  const createNewTag = async () => {
    // 验证输入值非空
    const value = inputValue.trim();
    if (!value) return;
    
    // 检查是否与现有标签重复
    if (tags.some(t => t.name.toLowerCase() === value.toLowerCase())) {
      return;
    }
    
    try {
      const response = await createTagAPI({ 
        name: value,
        type: 'private' // 默认创建为私人标签
      });
      
      const newTag = response.data.tag;
      
      // 更新用户标签列表
      setUserTags([...userTags, newTag]);
      
      // 添加到已选标签
      addTag(newTag);
    } catch (error) {
      console.error('创建标签失败:', error);
    }
  };
  
  // 移除标签
  const removeTag = async (tagId) => {
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    setTags(updatedTags);
    
    // 如果已关联文章，则向后端发送请求更新标签
    if (articleId) {
      try {
        // 需要发送所有剩余标签的ID
        const tagIds = updatedTags.map(tag => tag.id);
        
        await setArticleTagsAPI(articleId, { tagIds });
      } catch (error) {
        console.error('更新标签失败:', error);
      }
    }
    
    // 通知父组件标签变化
    if (onTagsChange) {
      onTagsChange(updatedTags);
    }
  };
  
  // 提交标签申请公开审核
  const submitForReview = async (tagId) => {
    try {
      await submitTagReviewAPI(tagId);
      
      // 更新本地标签状态
      const updatedUserTags = userTags.map(tag => 
        tag.id === tagId ? { ...tag, status: 'pending' } : tag
      );
      setUserTags(updatedUserTags);
      
      // 如果当前选中的标签中有这个标签，也更新它
      const updatedTags = tags.map(tag => 
        tag.id === tagId ? { ...tag, status: 'pending' } : tag
      );
      setTags(updatedTags);
      
      if (onTagsChange) {
        onTagsChange(updatedTags);
      }
      
      alert('标签已提交审核');
    } catch (error) {
      console.error('提交审核失败:', error);
    }
  };
  
  // 渲染标签项
  const renderTagItem = (tag) => {
    const isPublic = tag.type === 'public';
    const isPending = tag.status === 'pending';
    
    return (
      <div 
        key={tag.id} 
        className={`${styles.tagItem} ${isPublic ? styles.publicTag : styles.privateTag}`}
        onClick={() => addTag(tag)}
      >
        <span className={styles.tagName}>{tag.name}</span>
        <span className={styles.tagType}>
          {isPublic ? '公共' : '私人'}
          {isPending && ' (审核中)'}
        </span>
        <span className={styles.tagCount}>{tag.count || 0}篇文章</span>
      </div>
    );
  };
  
  // 如果是只读模式，只显示标签列表
  if (!isEditMode) {
    return (
      <div className={styles.tagsContainer}>
        {tags.length > 0 ? (
          <div className={styles.tagsList}>
            {tags.map(tag => (
              <span 
                key={tag.id} 
                className={`${styles.tag} ${tag.type === 'public' ? styles.publicTag : styles.privateTag}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        ) : (
          <span className={styles.noTags}>暂无标签</span>
        )}
      </div>
    );
  }
  
  return (
    <div className={styles.tagSelector}>
      <div className={styles.selectedTags}>
        {tags.map(tag => (
          <div 
            key={tag.id} 
            className={`${styles.tag} ${tag.type === 'public' ? styles.publicTag : styles.privateTag}`}
          >
            <span>{tag.name}</span>
            <button 
              type="button" 
              className={styles.removeTag} 
              onClick={() => removeTag(tag.id)}
            >
              ×
            </button>
            {tag.type === 'private' && tag.status === 'approved' && (
              <button 
                type="button" 
                className={styles.submitReview} 
                onClick={() => submitForReview(tag.id)}
                title="申请加入公共标签"
              >
                ↑
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className={styles.tagInputContainer}>
        <input
          ref={inputRef}
          type="text"
          className={styles.tagInput}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder="输入标签名，选择或创建新标签"
        />
        
        {inputValue.trim() && (
          <button 
            type="button" 
            className={styles.createTagBtn}
            onClick={createNewTag}
          >
            创建"{inputValue.trim()}"
          </button>
        )}
      </div>
      
      {showDropdown && (
        <div className={styles.tagSuggestions}>
          <div className={styles.suggestionList}>
            {isLoading ? (
              <div className={styles.loading}>加载中...</div>
            ) : suggestions.length > 0 ? (
              suggestions.map(tag => renderTagItem(tag))
            ) : (
              <div className={styles.noSuggestions}>
                {inputValue.trim() ? '没有匹配的标签，可以创建新标签' : '暂无可用标签'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;