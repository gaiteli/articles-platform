import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, message, Upload, Select } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Quill from 'quill';

import { Header } from '/src/components/articles_platform/Header'
import EditorContent from '../../../components/common/QuillEditorPlus/EditorContent';
import EditorToolbar from '../../../components/common/QuillEditorPlus/EditorToolbar';
import PopoutChannelPage from '/src/components/articles_platform/popouts/PopoutChannelPage';

import { getArticleByIdAPI, updateArticleAPI } from '/src/apis/articles_platform/article'
import { uploadAttachmentAPI } from '/src/apis/articles_platform/attachment';
import { createArticleAPI } from '/src/apis/articles_platform/article'
import styles from './index.module.scss'

import { addHeaderIdToHTML } from '/src/utils/quill';


const Delta = Quill.import('delta');
const { Option } = Select;

const ArticlesPlatformArticleEditPage = () => {
  const { id } = useParams();  // 从路由中获取articleId，若undefined则为首次编辑
  const articleId = id      // 因为名称要和路由中的参数名一致，所以这里重新赋值
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(!!articleId); // 判断是否为编辑模式
  const [coverImageUrl, setCoverImageUrl] = useState(null)
  const [fetchCoverError, setFetchCoverError] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false)
  const [isShowChannelPage, setIsShowChannelPage] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // debug
  const [isShowDebug, setIsShowDebug] = useState(false)
  const [range, setRange] = useState()
  const [lastChange, setLastChange] = useState()
  const [readOnly, setReadOnly] = useState(false)

  // Use a ref to access the quill instance directly
  const quillRef = useRef(null)

  // popout传回选中的分类
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    console.log('选中的分类:', category);
  };

  // 编辑模式下加载文章数据
  useEffect(() => {
    if (articleId) {
      const loadArticle = async () => {
        setLoading(true);
        try {
          // 获取文章内容、标题、封面图url
          const res = await getArticleByIdAPI(articleId)
          console.log(res.data.cover);
          setCoverImageUrl(res.data.cover)
          setTitle(res.data.title)
          if (quillRef.current) {
            quillRef.current?.setContents(res.data.deltaContent)
            console.log('quill editor load success');
          }
        } catch (err) {
          message.error('加载文章失败:' + err);
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


  // 提交文章
  const handleArticleSubmit = async () => {
    setLoading(true)
    setError(null)

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

      // 给标题添加ID，方便生成目录


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
      setError(err.message || '提交文章失败')
      message.error('提交文章失败，请重试')
    } finally {
      setLoading(false)
    }
  }


  // 上传封面
  // 上传按钮
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  )

  // 上传前检查文件格式和大小
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG 或 PNG 格式的图片！');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！');
    }
    return isJpgOrPng && isLt2M;
  };

  // antd Upload组件的onChange回调
  const handleUploadOnchange = async (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      message.loading({ content: '正在上传...', key: 'upload' });
      return;
    }
    if (info.file.status === 'done') {
      message.success({ content: '上传成功', key: 'upload' });
      // 图片URL存储在info.file.response.url中，即info.file.response == res.data(上传回调的实参)
      setUploadLoading(false);
      console.log(info.file);
      setCoverImageUrl(info.file.response.url);
    } else if (info.file.status === 'error') {
      message.error({ content: '上传失败', key: 'upload' });
    }
  };

  // 上传回调
  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('image', file);

    try {
      // 后端返回的图片URL存储在res.data.url中
      const res = await uploadAttachmentAPI(formData);
      console.log(res);
      onSuccess(res.data, file);
    } catch (error) {
      console.log('error in handleUpload func');
      onError(error);
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
          <aside className={styles.fixedArea}>
            <Upload
              name="cover"
              listType="picture-card"
              className={styles.coverUpload}
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleUploadOnchange}
              customRequest={handleUpload}
            >
              {coverImageUrl && !fetchCoverError ? (
                <img
                  src={coverImageUrl}
                  alt="cover"
                  style={{ width: '100%' }}
                  onError={() => setFetchCoverError(true)}
                />
              ) : (
                uploadButton
              )}
            </Upload>
            <button
              className={styles.chooseChannelButton}
              onClick={() => setIsShowChannelPage(true)}
            >选择分类</button>
          </aside>

          {/* 分类选择弹出页 */}
          {isShowChannelPage && (
            <PopoutChannelPage
              onClose={() => setIsShowChannelPage(false)}
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
      </Spin>
    </div>
  )
}

export default ArticlesPlatformArticleEditPage