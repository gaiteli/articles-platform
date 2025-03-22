import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { message, Popconfirm } from 'antd';
import Quill from 'quill';
import moment from 'moment';

import ErrorPage from '/src/pages/errors/ErrorPage';
import { Header } from '/src/components/articles_platform/Header';
import { getArticleByIdAPI, deleteArticleAPI } from '/src/apis/articles_platform/article';
import { generateUniqueId } from '/src/utils/quill';
import { withPermission } from '/src/components/withPermission'

import styles from './index.module.scss';
import TOC from '../../../components/common/QuillEditorPlus/TOC';

// 带权限校验的按钮
const EditButton = ({ id, $disabled }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(`./edit`)} className={styles.bottomButton} disabled={$disabled}>
      编辑
    </button>
  );
};

const DeleteButton = ({ id, $disabled }) => {
  const navigate = useNavigate();
  return (
    <Popconfirm
      description="是否删除这篇文章？"
      onConfirm={() => (async () => {
        await deleteArticleAPI(id);
        navigate('/articles/list');
      })()}
      okText="确定"
      cancelText="取消"
    >
      <button className={styles.bottomButton} disabled={$disabled}>删除</button>
    </Popconfirm>
  );
};

const EditButtonWithPermission = withPermission(EditButton);
const DeleteButtonWithPermission = withPermission(DeleteButton);


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


  // 获取文章详情
  useEffect(() => {
    const loadArticle = async () => {
      try {
        const res = await getArticleByIdAPI(id)
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
            {/* <button onClick={() => ???} className={styles.bottomButton}>点赞</button> */}
            <EditButtonWithPermission type="editOwnResource" resource={article} id={article.id} />
            <DeleteButtonWithPermission type="deleteOwnResource" resource={article} id={article.id} />
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