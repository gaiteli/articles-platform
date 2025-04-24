import { useEffect, useCallback, useState, useContext, useRef, useMemo } from 'react';
import { useParams, useNavigate, Navigate, useBlocker, useLocation } from 'react-router-dom';
import { Spin, message, Button, Modal, Popover, Tag } from 'antd';
import { SaveOutlined, TagsOutlined } from '@ant-design/icons';

// 组件components
import { Header } from '/src/components/articles_platform/Header'
import PopoutChannelPage from '/src/components/articles_platform/popouts/PopoutChannelPage';
import { useJttEditor } from '../../../components/common/JTTEditor/core/useJttEditor';
import MenuBar from '../../../components/common/JTTEditor/ui/MenuBar';
import ContentArea from '../../../components/common/JTTEditor/ui/ContentArea';
import LinkBubble from '../../../components/common/JTTEditor/ui/LinkBubble';
import TableMenu from '../../../components/common/JTTEditor/ui/TableMenu/index.jsx';
import { CategoryCard } from '../../../components/articles_platform/widgets/CategoryCard';
import { CoverUploader } from '/src/components/common/Upload';
import TagSelector from '../../../components/articles_platform/widgets/TagSelector';
import CharCountCircle from '../../../components/articles_platform/widgets/others/charCountCircle.jsx';

// 工具函数和样式
import {
  getArticleByIdWhenEditAPI,
  updateArticleAPI,
  createArticleAPI,
  saveDraftAPI,
  getNewArticleDraftAPI,
} from '/src/apis/articles_platform/article';
import styles from './index.module.scss'
import { AuthContext } from '/src/store/AuthContext';
import { getArticleLength } from '/src/utils/tiptap';
import { debounce } from '/src/utils';

const LOCAL_STORAGE_SAVE_INTERVAL = 2000; // 草稿本地保存cd时间
const LOCAL_STORAGE_KEY = 'article_draft'; // localStorage存储键名
const MAX_CHARS = 5000;


const ArticlesPlatformArticleEditPage = ({ isAuthorized }) => {
  const { id: articleId } = useParams();  // 从路由中获取articleId，若undefined则为首次编辑
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  // core state
  const [title, setTitle] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editorContent, setEditorContent] = useState('');

  // UI/Loading state
  const [loading, setLoading] = useState(!!articleId);
  const [isSaving, setIsSaving] = useState(false);           // For Publish/Update
  const [isSavingDraft, setIsSavingDraft] = useState(false); // For Draft
  const [isEditMode, setIsEditMode] = useState(!!articleId); // 判断是否为编辑模式
  const [isShowChannelPage, setIsShowChannelPage] = useState(false)
  const [tags, setTags] = useState([]);
  const [isShowTagModal, setIsShowTagModal] = useState(false);

  // 内容长度统计相关
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [percentage, setPercentage] = useState(0);

  // Draft state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedDraft, setLastSavedDraft] = useState(null);
  const [draftLoaded, setDraftLoaded] = useState(false); // 标记草稿是否已加载


  // 编辑器更新状态
  const handleEditorUpdate = ({ editor }) => {
    console.log('2 handleEditorUpdate');
    const htmlContent = editor.getHTML();
    if (htmlContent !== editorContent) {
      const text = htmlContent === '<p></p>' ? '' : htmlContent
      const textLength = getArticleLength(text, 'char-no-tag')
      const wordLength = getArticleLength(text, 'word')
      setPercentage(Math.round((100 / MAX_CHARS) * charCount))
      setCharCount(textLength)
      setWordCount(wordLength)
      setHasUnsavedChanges(true);       // 标记有未保存的变更
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


  // -------------------------- 草稿功能↓ -----------------------------------
  // 保存当前编辑状态到localStorage
  const saveToLocalStorage = useCallback(debounce(() => {
    if (!editor) return;
    const currentContent = editor.getHTML();
    const jsonContent = editor.getJSON();

    // 保存到localStorage
    const draftData = {
      articleId: articleId || null, // 如果是编辑模式则保存ID
      title,
      coverImageUrl,
      content: currentContent,
      jsonContent,
      channelId: selectedCategory?.id || null,
      channelName: selectedCategory?.name || null,
      lastSaved: new Date().toISOString(),
      tags: tags,
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draftData));
    console.log('Draft autosaved to localStorage');
  }, LOCAL_STORAGE_SAVE_INTERVAL), [editor, title, coverImageUrl, selectedCategory, articleId]);

  // 当编辑内容变更时，触发localStorage保存
  useEffect(() => {
    if (hasUnsavedChanges && editor) {
      saveToLocalStorage();
    }
  }, [editorContent, title, coverImageUrl, selectedCategory, hasUnsavedChanges, saveToLocalStorage]);

  // 保存草稿到后端
  const saveDraftToBackend = async () => {
    if (!editor) return;

    try {
      setIsSavingDraft(true);

      const htmlContent = editor.getHTML();
      const jsonContent = editor.getJSON();

      const draftData = {
        articleId: articleId || null,
        title: title || '无标题',
        cover: coverImageUrl,
        content: htmlContent,
        jsonContent: jsonContent,
        channelId: selectedCategory?.id || null,
        tags: tags
      };

      await saveDraftAPI(draftData);

      // 更新最后保存的草稿状态
      setLastSavedDraft({
        ...draftData,
        lastSaved: new Date().toISOString()
      });

      setHasUnsavedChanges(false);
      message.success('草稿保存成功');

      localStorage.removeItem(LOCAL_STORAGE_KEY);  // 清除localStorage中的草稿（因为已经保存到后端）

    } catch (err) {
      message.error('保存草稿失败: ' + (err.response?.data?.errors?.[0] || err.message));
    } finally {
      setIsSavingDraft(false);
    }
  };

  // 导航拦截器 - 阻止用户在有未保存更改时离开
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

  // 处理导航拦截确认
  useEffect(() => {
    if (blocker.state === 'blocked') {
      Modal.confirm({
        title: '您有未保存的更改',
        content: '是否保存为草稿后再离开？',
        okText: '保存',
        cancelText: '不保存',
        onOk: async () => {
          await saveDraftToBackend();
          blocker.proceed();
        },
        onCancel: () => {
          // 清除localStorage
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          setHasUnsavedChanges(false);
          blocker.proceed();
        }
      });
    }
  }, [blocker]);

  // 监听页面关闭/刷新事件
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        const message = '您有未保存的更改，确定要离开吗？';
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  // -------------------------- 草稿功能↑ -----------------------------------


  // 编辑模式下加载文章或草稿
  useEffect(() => {
    console.log('3 useEffect loadArticle');
    const loadContent = async () => {
      setLoading(true);

      try {
        // 检查localStorage中是否有草稿
        const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
        const parsedLocalDraft = localDraft ? JSON.parse(localDraft) : null;

        // 判断本地草稿是否匹配当前编辑的文章
        const isRelevantLocalDraft = parsedLocalDraft &&
          (
            (articleId && parsedLocalDraft.articleId === articleId) ||
            (!articleId && !parsedLocalDraft.articleId)
          );

        if (isRelevantLocalDraft) {
          // 有相关的本地草稿，提示用户是否使用
          const confirmResult = await new Promise(resolve => {
            Modal.confirm({
              title: '发现未保存的草稿',
              content: `是否恢复上次编辑的内容？(${new Date(parsedLocalDraft.lastSaved).toLocaleString()})`,
              okText: '恢复',
              cancelText: '不恢复',
              onOk: () => resolve(true),
              onCancel: () => resolve(false)
            });
          });

          if (confirmResult) {
            // 用户选择使用本地草稿
            setTitle(parsedLocalDraft.title || '');
            setCoverImageUrl(parsedLocalDraft.coverImageUrl || null);
            setSelectedCategory(
              parsedLocalDraft.channelId ?
                { id: parsedLocalDraft.channelId, name: parsedLocalDraft.channelName } :
                null
            );
            setTags(parsedLocalDraft.tags || []);

            if (editor) {
              editor.commands.setContent(parsedLocalDraft.jsonContent || '');
              setCharCount(getArticleLength(parsedLocalDraft.content || '', 'char-no-tag'));
              setWordCount(getArticleLength(parsedLocalDraft.content || '', 'word'))
            }

            setDraftLoaded(true);
            return; // 使用本地草稿后不再加载其他内容
          } else {
            // 用户选择不使用本地草稿，清除localStorage
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          }
        }

        // 编辑现有文章
        if (articleId) {
          const res = await getArticleByIdWhenEditAPI(articleId);

          // 鉴权，不能编辑他人的文章
          if (!isAuthorized) {
            if (res.data.userId !== user.id) {
              return <Navigate to="/error" replace state={{
                code: 403,
                type: '没有权限',
                message: '无权编辑他人文章'
              }} />;
            }
          }

          // 展示文章相关内容
          setCoverImageUrl(res.data.cover);
          setTitle(res.data.title);
          setSelectedCategory({ id: res.data.channelId, name: res.data.channelName });
          setTags(res.data.tags);

          if (editor) {
            editor.commands.setContent(res.data.jsonContent || '');
            setCharCount(getArticleLength(editor.getHTML(), 'char-no-tag'));
            setWordCount(getArticleLength(editor.getHTML(), 'word'))
          }

          document.querySelector('.ant-upload .anticon+div').innerHTML = '上传封面';
        }
        // 新建文章模式，尝试加载后端草稿
        else if (!draftLoaded) {
          try {
            const draftRes = await getNewArticleDraftAPI();

            if (draftRes.data) {
              // 有后端草稿，提示用户是否使用
              const useDraft = await new Promise(resolve => {
                Modal.confirm({
                  title: '发现草稿',
                  content: `是否继续编辑上次保存的草稿？(${new Date(draftRes.data.updatedAt).toLocaleString()})`,
                  okText: '继续编辑',
                  cancelText: '创建新文章',
                  onOk: () => resolve(true),
                  onCancel: () => resolve(false)
                });
              });

              if (useDraft) {
                // 使用后端草稿
                setTitle(draftRes.data.title || '');
                setCoverImageUrl(draftRes.data.cover || null);

                if (draftRes.data.channelId) {
                  setSelectedCategory({
                    id: draftRes.data.channelId,
                    name: draftRes.data.channelName || '未分类'
                  });
                }
                if (draftRes.data.tags) {
                  setTags(draftRes.data.tags);
                }

                if (editor) {
                  editor.commands.setContent(draftRes.data.jsonContent || '');
                  setCharCount(getArticleLength(draftRes.data.content || '', 'char-no-tag'));
                  setWordCount(getArticleLength(draftRes.data.content || '', 'word'))
                }
              }
            }
          } catch (err) {
            console.error('加载草稿失败:', err);
          }
        }

        setDraftLoaded(true);
      } catch (err) {
        message.error('加载内容失败:' + (err.response?.data?.errors?.[0] || err.message));
      } finally {
        setLoading(false);
      }
    };
    if (editor) {
      loadContent();
    }
  }, [articleId, editor]);


  // 分类handlers
  // popout传回选中的分类
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setHasUnsavedChanges(true);
    console.log('选中的分类:', category);
  };
  const handleClosePopout = () => setIsShowChannelPage(false);
  const handleRemoveCategory = () => {
    setSelectedCategory(null);
    setHasUnsavedChanges(true);
  }; // 清空选中的分类


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
      if (getArticleLength(htmlContent, 'char-no-tag') > MAX_CHARS) {
        message.error(`文章长度超出限制`);
        return;
      }

      const reqData = {
        title,
        cover: coverImageUrl || null,
        content: htmlContent,
        jsonContent: plainText ? jsonContent : null,
        channelId: selectedCategory?.id || 1,
        // tagIds: tags.map(tag => tag.id)
      }
      console.log('Submitting Data:', reqData);

      const submitSharedLogic = async (info, path) => {
        // 删除相关的草稿，因为文章已发布/更新
        // await deleteArticleDraftAPI(articleId); // 有bug
        localStorage.removeItem(LOCAL_STORAGE_KEY);

        message.success(info);
        setHasUnsavedChanges(false);
        navigate(path);
      }
      if (isEditMode) {
        await updateArticleAPI({ id: articleId, ...reqData });
        await submitSharedLogic('更新文章成功', `/articles/${articleId}`)
      } else {
        await createArticleAPI(reqData);
        await submitSharedLogic('提交文章成功', '/articles/list')
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
            <LinkBubble editor={editor} />
            <ContentArea editor={editor} />
            {editor && <TableMenu editor={editor} />}
          </div>

          {/* 额外信息栏 */}
          <div className={styles.extraInfo}>
            <div>
              <Button
                icon={<SaveOutlined />}
                onClick={saveDraftToBackend}
                loading={isSavingDraft}
                disabled={!hasUnsavedChanges}
                className={styles.draftButton}
              >
                保存为草稿
              </Button>
              {/* 草稿状态展示 */}
              {lastSavedDraft && (
                <div className={styles.draftInfo}>
                  <p>最后保存草稿: {new Date(lastSavedDraft.lastSaved).toLocaleString()}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleArticleSubmit}
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? '提交中...' : isEditMode ? '提交更改' : '发布文章'}
            </button>
            <div className={styles.miscInfo}>
              <div className={`${styles.characterCount} ${charCount >= MAX_CHARS ? styles.characterCountWarning : ''}`}>
                {hasUnsavedChanges && <span>• 未保存</span>}
                <CharCountCircle percentage={percentage} />
                {charCount} / {MAX_CHARS} 字符
                <br />
                {wordCount} 字（单词）
              </div>
            </div>

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

        {/* 标签选择按钮和显示区域 */}
        <div className={styles.tagSelectorContainer}>
          <button
            className={styles.chooseTagButton}
            onClick={() => setIsShowTagModal(true)}
          >
            <TagsOutlined /> 选择标签
          </button>

          {/* 显示已选标签 */}
          {tags?.length > 0 && (
            <div className={styles.selectedTagsPreview}>
              {tags.map(tag => (
                <Tag
                  key={tag.id}
                  color={tag.type === 'public' ? 'blue' : 'green'}
                  closable
                  onClose={() => {
                    const updatedTags = tags.filter(t => t.id !== tag.id);
                    setTags(updatedTags);
                    setHasUnsavedChanges(true);
                  }}
                >
                  {tag.name}
                </Tag>
              ))}
            </div>
          )}

          {/* 标签选择模态框 */}
          {isShowTagModal && (
            <Modal
              title="选择文章标签"
              width={800}
              open={isShowTagModal}
              onCancel={() => setIsShowTagModal(false)}
              footer={null}
            >
              <TagSelector
                articleId={articleId}
                initialTags={tags}
                onTagsChange={(updatedTags) => {
                  setTags(updatedTags);
                  setHasUnsavedChanges(true);
                }}
                isEditMode={true}
              />
            </Modal>
          )}
        </div>

      </aside>
    </div>
  )
}

export default ArticlesPlatformArticleEditPage