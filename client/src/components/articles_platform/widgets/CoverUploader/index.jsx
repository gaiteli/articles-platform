import React, { useState } from 'react';
import { Upload, Image, message } from 'antd';
import { LoadingOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { uploadCoverAPI } from '/src/apis/articles_platform/attachment';
import styles from './index.module.scss';

const CoverUploader = ({ coverImageUrl, onCoverChange }) => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [clickTimer, setClickTimer] = useState(null);
  const [uploaderPrompts, setUploaderPrompts] = useState(false)

  // 上传按钮
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  // 上传前检查
  const beforeUpload = (file) => {
    const isJpgOrPng = ['image/jpg','image/jpeg','image/png'].includes(file.type)
    if (!isJpgOrPng) {
      message.error('只能上传 JPG 或 PNG 格式的图片！');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！');
    }
    return isJpgOrPng && isLt2M;
  };

  // Upload组件的onChange回调
  const handleUploadOnchange = (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      message.loading({ content: '正在上传...', key: 'upload' });
      return;
    }
    if (info.file.status === 'done') {
      message.success({ content: '上传成功', key: 'upload' });
      setUploadLoading(false);
      onCoverChange(info.file.response.url);
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
      const res = await uploadCoverAPI(formData);
      onSuccess(res.data, file);
    } catch (error) {
      console.error('Upload error:', error);
      onError(error);
    }
  };

  // 封面图片点击处理
  const handleImageClick = (e) => {
    if (clickTimer) {        // 双击 - 上传
      clearTimeout(clickTimer);
      setClickTimer(null);
      return;               // 不阻止冒泡，让事件传递到 Upload 组件
    } else {                // 单击 - 预览
      e.stopPropagation();  // 单击时阻止冒泡到Upload组件
      setClickTimer(
        setTimeout(() => {
          setPreviewOpen(true);
          setClickTimer(null);
        }, 200)
      );
    }
  };

  // 显示封面预览或再上传提示信息，引导用户
  const handleMouseEnter = () => {
    setUploaderPrompts(true);
  };
  const handleMouseLeave = () => {
    setUploaderPrompts(false);
  };

  return (
    <>
      <Upload
        name="cover"
        listType="picture-card"
        className={styles.coverUpload}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleUploadOnchange}
        customRequest={handleUpload}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt="cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onClick={handleImageClick}
          />
        ) : (
          uploadButton
        )}
      </Upload>

      {uploaderPrompts && (
        <div className={styles.uploaderPromptsContainer}>
          <QuestionCircleOutlined />
          <span>点击上传后单击图片预览，双击重选</span>
        </div>
      )}

      <div style={{ display: 'none' }}>
        <Image
          preview={{
            visible: previewOpen,
            src: coverImageUrl,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
        />
      </div>
    </>
  );
};

export default CoverUploader;