import React, { useEffect, useContext } from 'react';
import { message } from 'antd'

import ImageUploader from '../ImageUploader/ImageUploader';
import UploadCore from '../core/UploadCore';
import { AuthContext } from '/src/store/AuthContext';
import { uploadBgImageAPI } from '/src/apis/articles_platform/attachment';
import { updateBgImageAPI } from '/src/apis/articles_platform/user';

const bgUploadCore = new UploadCore({
  maxSize: 2,
  uploadAPI: uploadBgImageAPI,
  promptMessage: '点击上传后单击图片预览，双击重选'
});


export default function BgImageUploader({ bgImageUrl, onBgChange }) {
  const { updateUserInfo } = useContext(AuthContext)

  useEffect(() => {
    if (bgImageUrl) {
      const handleUploadSuccess = async (url) => {
        try {
          // 调用接口更新用户设置的背景图信息
          await updateBgImageAPI({ bgImageUrl: url });
          updateUserInfo({ bgImageUrl: url });
          message.success('背景设置成功');
        } catch (error) {
          message.error('背景更新失败');
          console.error('更新背景失败:', error);
        }
      };
      handleUploadSuccess(bgImageUrl)
    }
  }, [bgImageUrl])

  return (
    <ImageUploader
      imageUrl={bgImageUrl}
      onImageChange={onBgChange}
      uploadCore={bgUploadCore}
    />
  );
}