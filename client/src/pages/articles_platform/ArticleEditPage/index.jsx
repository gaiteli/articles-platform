import { useEffect, useRef, useState } from 'react';
import { Spin, message } from 'antd';
import { Header } from '/src/components/articles_platform/Header'
import EditorContent from '../../../components/common/QuillEditorPlus/EditorContent';
import EditorToolbar from '../../../components/common/QuillEditorPlus/EditorToolbar';

import { createArticleAPI } from '/src/apis/articles_platform/article'
import styles from './index.module.scss'
import Quill from 'quill';

const Delta = Quill.import('delta');

const ArticlesPlatformArticlePage = () => {

  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // debug
  const [isShowDebug, setIsShowDebug] = useState(false)
  const [range, setRange] = useState()
  const [lastChange, setLastChange] = useState()
  const [readOnly, setReadOnly] = useState(false)

  // Use a ref to access the quill instance directly
  const quillRef = useRef(null)

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

      // 检查标题是否为空
      if (!title.trim()) {
        alert('请输入文章标题')
        return
      }

      // 检查纯文本是否只包含空白字符
      if (!plainText) {
        alert('请输入文章内容')
        return
      }

      const reqData = {
        title,
        content: htmlContent,
        deltaContent: plainText ? deltaContent : null,
        channel_id: 1
      }
      await createArticleAPI(reqData)
      message.success('提交文章成功')
    } catch (err) {
      setError(err.message || '提交文章失败')
      message.error('提交文章失败，请重试')
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
              toolbarContainerId="custom-toolbar-container"
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
              {loading ? '提交中...' : '提交文章'}
            </button>
            <span>字数：{quillRef.current?.getText().replace(/\n/g, '').length || 0}</span>
          </div>
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

export default ArticlesPlatformArticlePage