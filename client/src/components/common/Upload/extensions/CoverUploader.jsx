import React from 'react';
// import { Space, Button, Watermark } from 'antd'

import ImageUploader from '../ImageUploader/ImageUploader';
import UploadCore from '../core/UploadCore';
import { uploadCoverAPI } from '/src/apis/articles_platform/attachment';

const coverUploadCore = new UploadCore({
  maxSize: 2,
  uploadAPI: uploadCoverAPI,
  promptMessage: '点击上传后单击图片预览，双击重选'
});

export default function CoverUploader({ coverUrl, onCoverChange }) {
  return (
    <ImageUploader
      imageUrl={coverUrl}
      onImageChange={onCoverChange}
      uploadCore={coverUploadCore}
      // previewProps={{
      //   maskClassName: 'custom-preview-mask',
      //   toolbarRender: (_, { actions }) => (
      //     <Space>
      //       <Button onClick={actions.zoomIn}>放大</Button>
      //       <Button onClick={actions.rotateLeft}>旋转</Button>
      //       <Button danger onClick={actions.close}>关闭</Button>
      //     </Space>
      //   ),
      //   imageRender: (originalNode) => (
      //     <Watermark content="机密">
      //       {originalNode}
      //     </Watermark>
      //   )
      // }}
    />
  );
}