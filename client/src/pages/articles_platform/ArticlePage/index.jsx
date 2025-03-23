import { useEffect, useRef, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { message } from 'antd';
import Quill from 'quill';
import moment from 'moment';

import { Header } from '/src/components/articles_platform/Header';
import { getArticleByIdAPI, hasLikedArticleAPI, likeArticleAPI } from '/src/apis/articles_platform/article';
import { generateUniqueId } from '/src/utils/quill';

import styles from './index.module.scss';
import TOC from '../../../components/common/QuillEditorPlus/TOC';
import {
  DeleteButtonWithPermission,
  EditButtonWithPermission,
  LikeButtonWithPermission,
} from '../../../components/permission/buttons';


const ArticlesPlatformArticlePage = () => {

  const { id } = useParams();
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const [fetchArticleError, setFetchArticleError] = useState(null);
  const [article, setArticle] = useState({
    title: '',
    channel: '',
    deltaContent: null,
    createdAt: '1970-01-01 00:00',
    readCount: 0,
    likeCount: 0,
  });
  const [headings, setHeadings] = useState([]); // 存储标题信息
  const [articleLength, setArticleLength] = useState(0);  // 文章长度
  const [hasLiked, setHasLiked] = useState(false)


  // 获取文章详情
  useEffect(() => {
    const loadArticle = async () => {
      try {
        const res = await getArticleByIdAPI(id)
        const hasLikeData = await hasLikedArticleAPI(id)
        setHasLiked(hasLikeData.data.hasLiked)
        setArticle(res.data)
      } catch (error) {
        console.log(error.response);
        setFetchArticleError({
          code: error.response.status,
          type: error.response.data.message,
          message: error.response.data.errors || '文章不存在'
        })
      }
    };
    loadArticle()
  }, [id])


  // 初始化 Quill 编辑器并设置内容、标题
  useEffect(() => {
    if (!article.deltaContent) return;

    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      readOnly: true,
      modules: {
        toolbar: false // 禁用自带工具栏
      }
    });
    quillRef.current = quill

    // 设置内容
    quill.setContents(article.deltaContent)
    setArticleLength(quill.getText().replace(/\n/g, '').length || 0)

    // 提取标题生成目录
    // 使用 setTimeout 确保内容渲染完成后再提取标题
    setTimeout(() => {
      const headingsNode = document.querySelectorAll('.ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4');
      const headingsData = Array.from(headingsNode).map((heading, index) => {
        const title = heading.textContent;
        const level = heading.tagName.toLowerCase()
        const id = generateUniqueId(title, index); // 生成唯一 ID
        heading.setAttribute('id', id);

        return {
          id,
          title,
          level,
        };
      });

      setHeadings(headingsData);
    }, 0);

    // 清理函数
    return () => {
      quillRef.current = null
    };
  }, [article.deltaContent])


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
          </div>
          <hr className={styles.titleDivider} />
        </div>

        {/* 文章内容 */}
        <div className={styles.contentContainer}>
          <div ref={editorRef} className={styles.quillContent} />
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
        <div className={styles.sidebar}>
          <TOC headings={headings} />
        </div>

      </div>
    </div>
  );
};

export default ArticlesPlatformArticlePage;