import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '/src/components/articles_platform/Header';
import { getArticleByIdAPI } from '/src/apis/articles_platform/article';
import styles from './index.module.scss';
import Quill from 'quill';

const ArticlesPlatformArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState({
    title: '',
    deltaContent: null
  });
  const editorRef = useRef(null);

  // 获取文章详情
  useEffect(() => {
    const loadArticle = async () => {
      try {
        const res = await getArticleByIdAPI(id);
        setArticle(res.data);
      } catch (error) {
        console.error('Failed to load article:', error);
      }
    };
    loadArticle();
  }, [id]);

  // 初始化 Quill 编辑器并设置内容
  useEffect(() => {
    if (!article.deltaContent) return;

    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      readOnly: true,
      modules: {
        toolbar: false // 禁用工具栏
      }
    });

    // 设置内容
    quill.setContents(article.deltaContent);

    // 清理函数
    return () => {
      quill.destroy();
    };
  }, [article.deltaContent]);

  return (
    <div className={styles.pageWrapper}>
      <Header position='sticky' />
      <div className={styles.articleContainer}>
        {/* 文章标题 */}
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{article.title}</h1>
          <hr className={styles.titleDivider} />
        </div>

        {/* 文章内容 */}
        <div className={styles.contentContainer}>
          <div ref={editorRef} className={styles.quillContent} />
        </div>

        {/* 额外信息栏 */}
        <div className={styles.extraInfo}>
          <span>阅读时间：约 {Math.ceil((article.deltaContent?.length || 0) / 1000)} 分钟</span>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPlatformArticlePage;