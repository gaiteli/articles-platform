import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '/src/components/articles_platform/Header';
import { getArticleByIdAPI } from '/src/apis/articles_platform/article';

import styles from './index.module.scss';
import Quill from 'quill';
import moment from 'moment';

const ArticlesPlatformArticlePage = () => {

  const { id } = useParams();
  const editorRef = useRef(null)
  const quillRef = useRef(null)
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
        console.error('获取文章失败：', error)
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
        <div className={styles.extraInfo}>
          <span>
            阅读时间：约 {Math.ceil(articleLength / 1000)} 分钟
          </span>
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