import { useState, useEffect, useRef, useMemo } from 'react';
import { submitFeedbackAPI, getFeedbacksAPI } from '/src/apis/articles_platform/feedback';

import styles from './index.module.scss';
import reactLogo from '@/assets/react.svg'
import lotus from '@/assets/articles_platform/lotus.svg'
import { Header } from '../../../components/articles_platform/Header';

const FeedbackPage = () => {
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const formRef = useRef(null);
  const textareaRef = useRef(null)

  // 按日期分组函数
  const groupByDate = (feedbacks) => {
    const grouped = {};
    feedbacks.forEach(feedback => {
      const date = new Date(feedback.createdAt).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(feedback);
    });
    return grouped;
  };

  // 获取反馈列表
  const fetchFeedbacks = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getFeedbacksAPI({ page, limit: 20 });
      setFeedbacks(res.data.feedbacks);
      setTotalPages(res.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('获取反馈列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 提交反馈
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await submitFeedbackAPI({ nickname, content });
      setNickname('');
      setContent('');
      fetchFeedbacks(1); // 刷新第一页
    } catch (error) {
      console.error('提交反馈失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextareaChange = (e) => {
    setContent(e.target.value)
    textareaRef.current.style.height = '60px';
    textareaRef.current.style.height = e.target.scrollHeight + 'px';
  }

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const groupedFeedbacks = useMemo(() => groupByDate(feedbacks), [feedbacks]);
  const dates = useMemo(() => Object.keys(groupedFeedbacks).sort((a, b) => new Date(b) - new Date(a)), [groupedFeedbacks]); // 日期倒序排列，最新的在前面

  return (
    <>
      <Header />
      <div className={styles.feedbackContainer}>
        {/* 发布区 */}
        <div className={styles.postArea}>
          <form ref={formRef} onSubmit={handleSubmit} className={styles.feedbackForm}>
            <div className={styles.formRow}>
              <h3 className='border-l-4 pl-2 '>留言板</h3>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="您的昵称(不超过30字)"
                className={styles.nicknameInput}
                maxLength="30"
              />
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || !content.trim()}
              >
                {loading ? '提交中...' : '发布留言'}
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextareaChange}
              placeholder="写下您的留言或反馈..."
              className={styles.contentInput}
              rows="2"
              required
            />
          </form>
        </div>

        {/* GitHub风格带日期分组的时间线 */}
        <div className={styles.timeline}>
          {dates.length > 0 ? (
            <ul className={styles.timelineList}>
              {dates.map((date, dateIndex) => (
                <li key={date} className={styles.dateGroup}>
                  {/* 日期标签 */}
                  <div className={styles.dateBadgeLogo}>
                    <img src={reactLogo} width='20px' />
                  </div>
                  <div className={styles.dateBadge}>
                    <span className={styles.dateText}>{date}</span>
                  </div>

                  {/* 该日期的所有留言 */}
                  <ul className={styles.dateItems}>
                    {groupedFeedbacks[date].map((feedback) => (
                      <li key={feedback.id} className={styles.timelineItem}>
                        {/* 留言卡片 */}
                        <div className={styles.timelineCard}>
                          <div className={styles.timelineCardBody}>
                            {feedback.content}
                          </div>
                          <span className={styles.timelineCardHeader}>
                            <span><img src={lotus} width='16px' /></span>
                            <span className={styles.nickname}>{feedback.nickname || '匿名用户'}</span>
                            <span className={styles.time}>
                              {new Date(feedback.createdAt).toLocaleTimeString()}
                            </span>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyMessage}>暂无留言，快来发表第一条吧~</div>
          )}
        </div>

        {/* 分页控制 */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchFeedbacks(page)}
                className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        <div className={styles.emptyMessage}>您的勉励是我前进的动力~</div>
      </div>
    </>
  );
};

export default FeedbackPage;