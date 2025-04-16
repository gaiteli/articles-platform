import React, { useState} from 'react';
import { Popover, Button, Space } from 'antd';

import ImageUploader from '../ImageUploader/ImageUploader';
import UploadCore from '../core/UploadCore';
import { 
  uploadCoverAPI, 
  getMyAttachmentsAPI, 
  deleteMyAttachmentAPI 
} from '/src/apis/articles_platform/attachment';

const coverUploadCore = new UploadCore({
  maxSize: 2,
  uploadAPI: uploadCoverAPI,
  promptMessage: '点击上传后单击图片预览，双击重选'
});

export default function CoverUploader({ coverUrl, onCoverChange }) {
  const [historyCovers, setHistoryCovers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 加载历史封面
  const loadHistoryCovers = async () => {
    setLoading(true);
    try {
      const res = await getMyAttachmentsAPI({ type: 'cover' });
      setHistoryCovers(res.data.attachments);
    } catch (error) {
      message.error('加载历史封面失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除封面
  const handleDeleteCover = async (id) => {
    try {
      await deleteCoverAPI(id);
      setHistoryCovers(historyCovers.filter(item => item !== url));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 默认封面选项
  const defaultCovers = [
    'https://example.com/default1.jpg',
    'https://example.com/default2.jpg',
  ];

  // Popover 内容
  const coverSelector = (
    <div style={{ width: 300 }}>
      <h4>默认封面</h4>
      <Space wrap>
        {defaultCovers.map(url => (
          <img
            key={url}
            src={url}
            alt="default"
            style={{ width: 80, height: 80, cursor: 'pointer' }}
            onClick={() => onCoverChange(url)}
          />
        ))}
      </Space>
      <h4>历史封面</h4>
      {loading ? (
        <div>加载中...</div>
      ) : (
        <Space wrap>
          {historyCovers.map(attachment => (
            <div key={attachment.url} style={{ position: 'relative' }}>
              <img
                src={attachment.url}
                alt="history"
                style={{ width: 80, height: 80, cursor: 'pointer' }}
                onClick={() => onCoverChange(attachment.url)}
              />
              <Button
                danger
                size="small"
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCover(attachment.id);
                }}
              >
                ×
              </Button>
            </div>
          ))}
        </Space>
      )}
    </div>
  );

  return (
    <Popover
      content={coverSelector}
      trigger="hover"
      onOpenChange={(visible) => {
        if (visible) loadHistoryCovers();
      }}
    >
      <div>
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
      </div>
    </Popover>
  );
}