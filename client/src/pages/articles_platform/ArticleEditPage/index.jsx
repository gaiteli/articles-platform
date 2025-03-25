import { useEffect, useRef, useState, useContext } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import Quill from 'quill';

import { AuthContext } from '/src/store/AuthContext';
import { Header } from '/src/components/articles_platform/Header'
import EditorContent from '../../../components/common/QuillEditorPlus/EditorContent';
import EditorToolbar from '../../../components/common/QuillEditorPlus/EditorToolbar';
import PopoutChannelPage from '/src/components/articles_platform/popouts/PopoutChannelPage';

import { getArticleByIdWhenEditAPI, updateArticleAPI } from '/src/apis/articles_platform/article'
import { createArticleAPI } from '/src/apis/articles_platform/article'
import styles from './index.module.scss'
import { CategoryCard } from '../../../components/articles_platform/widgets/CategoryCard';
import {CoverUploader} from '/src/components/common/Upload';


const Delta = Quill.import('delta');

const ArticlesPlatformArticleEditPage = ({isAuthorized}) => {
  const { id } = useParams();  // 从路由中获取articleId，若undefined则为首次编辑
  const articleId = id      // 因为名称要和路由中的参数名一致，所以这里重新赋值
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!articleId); // 判断是否为编辑模式
  const [coverImageUrl, setCoverImageUrl] = useState(null)
  const [isShowChannelPage, setIsShowChannelPage] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // debug
  const [isShowDebug, setIsShowDebug] = useState(false)
  const [range, setRange] = useState()
  const [lastChange, setLastChange] = useState()
  const [readOnly, setReadOnly] = useState(false)

  // Use a ref to access the quill instance directly
  const quillRef = useRef(null)


  // 编辑模式下加载文章数据
  useEffect(() => {
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
          if (quillRef.current) {
            quillRef.current?.setContents(res.data.deltaContent)
            console.log('quill editor load success');
          }
          
        } catch (err) {
          message.error('加载文章失败:' + err.response.errors[0]);
        } finally {
          setLoading(false);
        }
      };
      loadArticle();
    }
  }, [articleId]);

  // 修改antd Upload组件内部提示文字
  useEffect(() => {
    document.querySelector('.ant-upload button div').innerHTML = '上传封面'
  }, [])

  
  // popout传回选中的分类
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    console.log('选中的分类:', category);
  };

  const handleClosePopout = () => {
    setIsShowChannelPage(false);
  }

  // 处理分类删除
  const handleRemoveCategory = () => {
    setSelectedCategory(null); // 清空选中的分类
  };


  // 提交文章
  const handleArticleSubmit = async () => {
    setLoading(true)

    try {
      // 获取纯文本内容并去除首尾空格
      const plainText = quillRef.current?.getText()?.trim() || ''
      // 获取HTML内容
      const htmlContent = quillRef.current?.getSemanticHTML() || ''
      // 获取Delta内容
      const deltaContent = quillRef.current?.getContents()
      // const { updatedHtmlContent } = addHeaderIdToHTML( htmlContent);

      // 检查标题是否为空
      if (!title.trim()) {
        message.error('请输入文章标题')
        return
      }

      // 提示用户确定不上传封面图
      if (!coverImageUrl) {
        // message.warning('确定不上传封面图？')  // 写一个组件让message有确定和取消按钮功能
        if (!window.confirm('确定不上传封面图？')) {
          return
        }
      }

      // 检查纯文本是否只包含空白字符
      if (!plainText) {
        message.error('请输入文章内容')
        return
      }


      const reqData = {
        title,
        cover: coverImageUrl || null,
        content: htmlContent,
        deltaContent: plainText ? deltaContent : null,
        channelId: selectedCategory?.id || 1
      }
      console.log(reqData);

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


  return (
    <div className={styles.pageWrapper}>
      <Header position='static' />
      {/* Toolbar部分 */}
      <header className={styles.editorToolbarContainer} >
        <EditorToolbar />
      </header>
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
            <EditorContent
              toolbarContainerId="custom-toolbar-container"   // 工具栏挂载点
              ref={quillRef}
              readOnly={false}
              defaultValue={null}
              onTextChange={setLastChange}
              onSelectionChange={setRange}
            />
          </div>

          {/* 额外信息栏 */}
          <div className={styles.extraInfo}>
            <button onClick={() => setIsShowDebug(!isShowDebug)} style={{ color: 'lightgrey' }}>显示调试</button>
            <button
              onClick={handleArticleSubmit}
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? '提交中...' : isEditMode ? '提交更改' : '发布文章'}
            </button>
            <span style={{ color: 'grey' }}>
              字数：{quillRef.current?.getText().replace(/\n/g, '').length || 0}
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

          {/* debug area */}
          {isShowDebug && (
            <>
              <div className={styles.debugArea}>
                <label>
                  Read Only:{' '}
                  <input
                    type="checkbox"
                    value={readOnly}
                    onChange={(e) => setReadOnly(e.target.checked)}
                  />
                </label>
                <button
                  className={styles.controlsRight}
                  type="button"
                  onClick={() => {
                    alert(quillRef.current?.getLength())
                  }}
                >
                  Get Content Length
                </button>
                <button
                  className={styles.controlsRight}
                  type="button"
                  onClick={() => {
                    console.dir(quillRef.current?.getContents())
                  }}
                >
                  Get Content Delta
                </button>
                <button
                  className={styles.controlsRight}
                  type="button"
                  onClick={() => {
                    console.dir(quillRef.current?.getText())
                    console.dir(quillRef.current?.getSemanticHTML())
                  }}
                >
                  Get Text content
                </button>
              </div>
              <div className={styles.state}>
                <div className={styles.stateTitle}>Current Range:</div>
                {range ? JSON.stringify(range) : 'Empty'}
              </div>
              <div className={styles.state}>
                <div className={styles.stateTitle}>Last Change:</div>
                {lastChange ? JSON.stringify(lastChange.ops) : 'Empty'}
              </div>
            </>
          )}
        </div>

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
      </Spin>
    </div>
  )
}

export default ArticlesPlatformArticleEditPage