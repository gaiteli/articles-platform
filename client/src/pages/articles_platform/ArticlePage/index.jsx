import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '/src/components/articles_platform/Header';
import { getArticleByIdAPI, deleteArticleAPI } from '/src/apis/articles_platform/article';

import { message, Popconfirm } from 'antd';
import styles from './index.module.scss';
import Quill from 'quill';
import moment from 'moment';
import ErrorPage from '../../ErrorPage';

const ArticlesPlatformArticlePage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const [fetchArticleError, setFetchArticleError] = useState(null);
  const [article, setArticle] = useState({
    title: '',
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
    const editorElement = editorRef.current;
    const headingElements = editorElement.querySelectorAll('h1, h2, h3');
    const headingList = Array.from(headingElements).map((heading) => ({
      id: heading.id || heading.textContent.toLowerCase().replace(/\s+/g, '-'),
      text: heading.textContent,
      level: heading.tagName.toLowerCase()
    }));
    console.log(headingList);
    setHeadings(headingList)

    // 清理函数
    return () => {
      quillRef.current = null
    };
  }, [article.deltaContent])


  // 点击目录项滚动到对应位置
  const scrollToHeading = (id) => {
    console.log(id);
    const headingElement = document.getElementById(id);
    if (headingElement) {
      console.log('get !');
      headingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };


  // 文章加载出错（404），返回错误页面
  if (fetchArticleError) {
    return (
      <div className={styles.pageWrapper}>
        <Header position='sticky' />
        <ErrorPage
          errorCode={fetchArticleError.code}
          type={fetchArticleError.type}
          message={fetchArticleError.message}
        />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Header position='sticky' />
      <div className={styles.articleContainer}>

        {/* 文章标题 */}
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.metaInfo}>
            <span>发布于 {moment(article.createdAt).format('YYYY-MM-DD HH:mm')}</span>
            <span>浏览数 {article.readCount}</span>
            <span>点赞数 {article.likeCount}</span>
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
            阅读时间：约 {Math.ceil(articleLength / 1000)} 分钟
          </span>
          <div className='flex flex-row justify-end'>
            {/* <button onClick={() => ???} className={styles.bottomButton}>点赞</button> */}
            <button onClick={() => navigate('./edit')} className={styles.bottomButton}>编辑</button>
            <Popconfirm
              description="是否删除这篇文章？"
              onConfirm={() => (async () => {
                await deleteArticleAPI(id)
                navigate('/articles/list')
              })()}
              okText="确定"
              cancelText="取消"
            >
              <button className={styles.bottomButton}>删除</button>
            </Popconfirm>
          </div>
        </div>

        {/* 右侧目录 */}
        <div className={styles.sidebar}>
          <div className={styles.toc}>
            <h3>目录</h3>
            <ul>
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  className={styles[`toc-${heading.level}`]}
                  onClick={() => scrollToHeading(heading.id)}
                >
                  {heading.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArticlesPlatformArticlePage;