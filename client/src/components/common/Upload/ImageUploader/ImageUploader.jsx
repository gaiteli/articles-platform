import React, { useState } from 'react';
import { Upload, Image, message } from 'antd';
import { LoadingOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import styles from './index.module.scss'

export default function ImageUploader({
  imageUrl,
  onImageChange,
  uploadCore,
  renderUploadButton,     // 函数，返回自定义上传按钮组件：renderUp..={(isLoading) => (/* 组件 */)
  renderPrompts,        // 函数，返回自定义提示组件
  previewProps        // 图片预览扩展参数
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [clickTimer, setClickTimer] = useState(null);

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      message.loading({ content: '上传中...', key: 'upload' });
      return;
    }

    if (info.file.status === 'done') {
      message.success({ content: '上传成功', key: 'upload' });
      setUploadLoading(false);
      onImageChange(info.file.response?.url);
    }

    if (info.file.status === 'error') {
      message.error({ content: '上传失败', key: 'upload' });
      setUploadLoading(false);
    }
  };

  const handleImageClick = (e) => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);
      return;
    }

    e.stopPropagation();
    setClickTimer(
      setTimeout(() => {
        setPreviewOpen(true);
        setClickTimer(null);
      }, 200)
    );
  };

  const defaultUploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{uploadCore.defaultConfig.uploadText}</div>
    </button>
  );

  const defaultPrompts = (
    <div className={styles.promptContainer}>
      <QuestionCircleOutlined />
      <span>{uploadCore.defaultConfig.promptMessage}</span>
    </div>
  );

  return (
    <>
      <div className={styles.uploadWrapper}>
        <Upload
          name="file"
          listType="picture-card"
          showUploadList={false}
          beforeUpload={uploadCore.beforeUpload}
          customRequest={uploadCore.handleUpload}
          onChange={handleChange}
          onMouseEnter={() => setShowPrompts(true)}
          onMouseLeave={() => setShowPrompts(false)}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onClick={handleImageClick}
            />
          ) : (
            renderUploadButton?.(uploadLoading) || defaultUploadButton
          )}
        </Upload>

        {showPrompts && (renderPrompts?.() || defaultPrompts)}
      </div>

      <div style={{ display: 'none' }}>
        <Image.PreviewGroup preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
          ...previewProps
        }}>
          {imageUrl && <Image src={imageUrl} style={{ display: 'none' }} />}
        </Image.PreviewGroup>
      </div>
    </>
  );
}