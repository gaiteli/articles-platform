import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { message } from 'antd';
import { InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

import { Header } from '/src/components/articles_platform/Header';
import { getArticleByIdAPI, hasLikedArticleAPI, likeArticleAPI } from '/src/apis/articles_platform/article';
import { extractTitles, getArticleLength } from '/src/utils/tiptap';
import { useJttEditor } from '../../../components/common/JTTEditor/core/useJttEditor';
import ContentArea from '../../../components/common/JTTEditor/ui/ContentArea';

import styles from './index.module.scss';
import TOC from '../../../components/common/JTTEditor/TOC';
import {
  DeleteButtonWithPermission,
  EditButtonWithPermission,
  LikeButtonWithPermission,
} from '../../../components/permission/buttons';

const ArticlesPlatformArticlePage = () => {
  const { id } = useParams();
  const [fetchArticleError, setFetchArticleError] = useState(null);
  const [article, setArticle] = useState({
    title: '',
    channel: '',
    jsonContent: null,
    createdAt: '1970-01-01 00:00',
    readCount: 0,
    likeCount: 0,
  });
  const [headings, setHeadings] = useState([]); // 存储标题信息
  const [articleLength, setArticleLength] = useState(0);  // 文章长度
  const [hasLiked, setHasLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const editorConfig = {
    preset: 'article',
    initialContent: '',
    editable: false,
    editorProps: {},
  }
  const editor = useJttEditor(editorConfig)


  // 获取文章详情
  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true);
      setFetchArticleError(null);
      try {
        // 并行获取
        const [articleRes, hasLikeRes] = await Promise.all([
          getArticleByIdAPI(id),
          hasLikedArticleAPI(id)
        ]);
        setArticle(articleRes.data);
        setHasLiked(hasLikeRes.data.hasLiked);

        // 确保编辑器生成后再设置内容
        if (editor) {
          editor.commands.setContent(articleRes.data.jsonContent || '');

          // 计算长度
          setArticleLength(getArticleLength(articleRes.data.content, 'chars'));

          // 提取标题
          setTimeout(() => {
            const hData = extractTitles(document.querySelector('.tiptap'))
            setHeadings(hData);
          }, 0);
        }

      } catch (error) {
        console.log(error.response);
        setFetchArticleError({
          code: error.response?.status || 500,
          type: error.response?.data?.message || '错误',
          message: error.response.data.errors || '文章不存在'
        })
      } finally {
        setIsLoading(false);
      }
    };
    loadArticle()
  }, [id])


  // 处理点赞/取消点赞
  const handleLike = async () => {
    try {
      console.log('进入点赞处理onclick');
      await likeArticleAPI(id)
      setHasLiked(!hasLiked);       // setHasLiked(prev => !prev);
      message.success(hasLiked ? '取消点赞成功' : '点赞成功');
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 文章加载出错（404），返回错误页面
  if (fetchArticleError) {
    return <Navigate to="/error" replace state={{
      code: fetchArticleError.code,
      type: fetchArticleError.type,
      message: fetchArticleError.message
    }} />;
  }

  return (
    <div className={styles.pageWrapper}>
      <Header position='sticky' />
      <div className={styles.articleContainer} data-channel={article.channelName}>

        {/* 文章标题 */}
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.metaInfo}>
            <span>发布于 {moment(article.createdAt).format('YYYY-MM-DD HH:mm')}</span>
            <span>浏览数 {article.readCount}</span>
            <span>点赞数 {article.likeCount}</span>
            <span>
              阅读时间：{articleLength < 250 ? `小于 1 分钟` : `约 ${Math.ceil(articleLength / 1000)} 分钟`}
            </span>
            {article.status === 0 &&
              <span style={{ color: 'orange' }}><InfoCircleOutlined />文章正在审核中...</span>}
            {article.status === 2 &&
              <span style={{ color: 'red' }}><CloseCircleOutlined />文章已锁定，请修改后重新提交审核！</span>}
          </div>
          <hr className={styles.titleDivider} />
        </div>

        {/* 文章内容 */}
        <div className={styles.contentContainer}>
          <ContentArea editor={editor} />
        </div>

        {/* 额外信息栏 */}
        <div className={`${styles.extraInfo} flex flex-row justify-between`}>
          <span>

          </span>
          <div className='flex flex-row justify-end'>
            <LikeButtonWithPermission
              type="likeArticle"
              resource={article}
              onClick={handleLike}
              hasLiked={hasLiked}
              className={styles.LikeButton}
            />
            <EditButtonWithPermission
              type="editOwnResource"
              resource={article}
              id={article.id}
              className={styles.bottomButton} />
            <DeleteButtonWithPermission
              type="deleteOwnResource"
              resource={article}
              id={article.id}
              className={styles.bottomButton}
            />
          </div>
        </div>

        {/* 右侧目录 */}
        {headings.length > 0 && (
          <div className={styles.sidebar}>
            <TOC headings={headings} />
          </div>
        )}

      </div>
    </div>
  );
};

export default ArticlesPlatformArticlePage;