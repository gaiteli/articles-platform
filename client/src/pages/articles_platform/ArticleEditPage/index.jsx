import { useEffect, useCallback, useState, useContext, useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Spin, message } from 'antd';

import { AuthContext } from '/src/store/AuthContext';
import { Header } from '/src/components/articles_platform/Header'
import PopoutChannelPage from '/src/components/articles_platform/popouts/PopoutChannelPage';

import { useJttEditor } from '../../../components/common/JTTEditor/core/useJttEditor';
import MenuBar from '../../../components/common/JTTEditor/ui/MenuBar';
import ContentArea from '../../../components/common/JTTEditor/ui/ContentArea';

import { getArticleByIdWhenEditAPI, updateArticleAPI } from '/src/apis/articles_platform/article'
import { createArticleAPI } from '/src/apis/articles_platform/article'
import styles from './index.module.scss'
import { CategoryCard } from '../../../components/articles_platform/widgets/CategoryCard';
import { CoverUploader } from '/src/components/common/Upload';
import { getArticleLength } from '/src/utils/tiptap';


const ArticlesPlatformArticleEditPage = ({ isAuthorized }) => {
  console.log('1');
  const { id } = useParams();  // 从路由中获取articleId，若undefined则为首次编辑
  const articleId = id      // 因为名称要和路由中的参数名一致，所以这里重新赋值
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(!!articleId);
  const [isEditMode, setIsEditMode] = useState(!!articleId); // 判断是否为编辑模式
  const [coverImageUrl, setCoverImageUrl] = useState(null)
  const [isShowChannelPage, setIsShowChannelPage] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editorContent, setEditorContent] = useState('');
  const [charCount, setCharCount] = useState(0);


  // 编辑器初始化
  const handleEditorUpdate = ({editor}) => {
    console.log('2 handleEditorUpdate');
    const htmlContent = editor.getHTML();
    if (htmlContent !== editorContent) {
      const text = htmlContent === '<p></p>' ? '' : htmlContent
      // setEditorContent(text);
      setCharCount(getArticleLength(text, 'char-no-tag'))
    }
  }

  const EditorConfig = {
    preset: 'article',
    initialContent: editorContent,
    editable: true,
    onUpdate: handleEditorUpdate,
    editorProps: {},
  }
  const editor = useJttEditor(EditorConfig);


  // 编辑模式下加载文章数据
  useEffect(() => {
    console.log('3 useEffect loadArticle');
    if (articleId) {
      const loadArticle = async () => {
        setLoading(true);
        try {
          // 获取文章内容、标题、封面图url
          const res = await getArticleByIdWhenEditAPI(articleId)

          // 鉴权，不能编辑他人的文章
          if (!isAuthorized) {
            if (res.data.userId !== user.id) {    // 不是自己的文章，不能编辑
              return <Navigate to="/error" replace state={{
                code: 403,
                type: '没有权限',
                message: '无权编辑他人文章'
              }} />;
            }
          }

          // 展示文章相关内容
          setCoverImageUrl(res.data.cover)
          setTitle(res.data.title)
          setSelectedCategory({ id: res.data.channelId, name: res.data.channelName })
          console.log('4 useEffect loadArticle setArticle');

          if (editor) {
            editor.commands.setContent(res.data.jsonContent || '')
            setCharCount(getArticleLength(editor.getHTML(), 'char-no-tag'))
            // 若HTML格式：editor.commands.setContent(res.data.content || '')
            console.log('5 TipTap editor load success');
          }
          document.querySelector('.ant-upload .anticon+div').innerHTML = '上传封面'
        } catch (err) {
          message.error('加载文章失败:' + err.response.errors[0]);
        } finally {
          setLoading(false);
        }
      };
      loadArticle();
    }
  }, [articleId]);


  // 分类handlers
  // popout传回选中的分类
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    console.log('选中的分类:', category);
  };
  const handleClosePopout = () => setIsShowChannelPage(false);
  const handleRemoveCategory = () => setSelectedCategory(null); // 清空选中的分类


  // 提交文章
  const handleArticleSubmit = async () => {
    setLoading(true)

    try {
      const plainText = editor?.getText()?.trim() || ''  // 获取纯文本内容并去除首尾空格
      const htmlContent = editor?.getHTML() || ''     // 获取HTML内容
      const jsonContent = editor?.getJSON() || null  // 获取JSON内容

      // 校验
      if (!title.trim()) {
        message.error('请输入文章标题')
        return
      }
      if (!coverImageUrl) {
        // message.warning('确定不上传封面图？')  // 写一个组件让message有确定和取消按钮功能
        if (!window.confirm('确定不上传封面图？')) {
          return
        }
      }
      if (!plainText) {     // 检查纯文本是否只包含空白字符
        message.error('请输入文章内容')
        return
      }

      const reqData = {
        title,
        cover: coverImageUrl || null,
        content: htmlContent,
        jsonContent: plainText ? jsonContent : null,
        channelId: selectedCategory?.id || 1
      }
      console.log('Submitting Data:', reqData);

      if (isEditMode) {
        await updateArticleAPI({ id: articleId, ...reqData });
        message.success('更新文章成功');
        navigate(`/articles/${id}`)
      } else {
        await createArticleAPI(reqData);
        message.success('提交文章成功');
        navigate('/articles/list')
      }

    } catch (err) {
      message.error('提交文章失败，请重试! 错误：' + err.response.data.errors[0])
    } finally {
      setLoading(false)
    }
  }


  if (loading && isEditMode) {
    // 编辑模式加载文章数据时显示骨架屏
    return (
      <div className={styles.pageWrapper}>
        <Header position='static' />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="正在加载文章内容..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Header position='static' />
        {console.log('7 return()')}
        {/* Toolbar部分 */}
        <header className={styles.editorToolbarContainer} >
          <MenuBar editor={editor} preset='article' />
        </header>
        {/* Content Area部分 */}
        <Spin spinning={loading} tip="正在提交...">
          <div className={styles.editorContainer}>

            {/* 标题输入框 */}
            <div className={styles.titleContainer}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入标题"
                className={styles.titleInput}
              />
              <hr className={styles.titleDivider} />
            </div>

            {/* 内容编辑器 */}
            <div className={styles.contentContainer}>
              <ContentArea editor={editor} />
            </div>

            {/* 额外信息栏 */}
            <div className={styles.extraInfo}>
              <button style={{ backgroundColor: 'transparent', cursor: 'default' }}></button>
              <button
                onClick={handleArticleSubmit}
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? '提交中...' : isEditMode ? '提交更改' : '发布文章'}
              </button>
              <span style={{ color: 'grey' }}>
                字数：{charCount}
              </span>
            </div>

            {/* 分类选择弹出页 */}
            {isShowChannelPage && (
              <PopoutChannelPage
                chosenCategory={selectedCategory}
                onClose={handleClosePopout}
                onSubmit={handleSelectCategory}
              />
            )}

          </div>
        </Spin>

      {/* 侧边信息&上传区 */}
      <aside className={styles.fixedArea}>

        {/* 封面上传区 */}
        <CoverUploader
          coverUrl={coverImageUrl}
          onCoverChange={setCoverImageUrl}
        />

        {/* 分类选择按钮和显示区域 */}
        <div className={styles.categoryContainer}>
          <button
            className={styles.chooseChannelButton}
            onClick={() => setIsShowChannelPage(true)}
          >
            选择分类
          </button>
          {/* 显示已选分类的卡片 */}
          {selectedCategory && (
            <CategoryCard
              category={selectedCategory}
              onRemove={handleRemoveCategory}
            />
          )}
        </div>
      </aside>
    </div>
  )
}

export default ArticlesPlatformArticleEditPage