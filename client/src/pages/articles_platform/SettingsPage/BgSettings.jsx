import { useState } from 'react';
import { Button, Space, Image } from 'antd';
import BgImageUploader from '../../../components/common/Upload/extensions/BgImageUploader';
import { getMyAttachmentsAPI } from '/src/apis/articles_platform/attachment'
import styles from './BgSettings.module.scss';

// 默认背景图列表
const DEFAULT_BGS = [
  'https://example.com/default-bg1.jpg',
  'https://example.com/default-bg2.jpg',
];

const BgSettings = () => {
  const [bgImageUrl, setBgImageUrl] = useState(null);
  const [showDefaultBgs, setShowDefaultBgs] = useState(false);
  const [showHistoryBgs, setShowHistoryBgs] = useState(false);
  const [historyBgs, setHistoryBgs] = useState([]);
  const [loading, setLoading] = useState(false);

  // 加载历史背景图
  const loadHistoryBgs = async () => {
    setLoading(true);
    try {
      const res = await getMyAttachmentsAPI({ type: 'bg' });
      setHistoryBgs(res.data.attachments);
    } catch (error) {
      console.error('加载历史背景失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.bgSettings}>
      <h2>更换首页背景</h2>

      {/* 当前背景图预览 */}
      {/* developing... */}

      {/* 上传组件 */}
      <div className={styles.bgUploaderContainer}>
        <BgImageUploader
          bgImageUrl={bgImageUrl}
          onBgChange={setBgImageUrl}
        />
      </div>

      {/* 操作按钮组 */}
      <Space className={styles.actionButtons}>
        <Button 
          type="text" 
          onClick={() => {
            setShowDefaultBgs(true);
            setShowHistoryBgs(false);
          }}
        >
          选择默认图
        </Button>
        <Button 
          type="text" 
          onClick={() => {
            setShowHistoryBgs(true);
            setShowDefaultBgs(false);
            loadHistoryBgs();
          }}
        >
          在历史背景中选择
        </Button>
      </Space>

      {/* 默认背景图选择区 */}
      {showDefaultBgs && (
        <div className={styles.bgSelector}>
          <h4>默认背景图</h4>
          <Space wrap>
            {DEFAULT_BGS.map(url => (
              <Image
                key={url}
                src={url}
                alt="default-bg"
                width={120}
                preview={false}
                style={{ cursor: 'pointer', border: bgImageUrl === url ? '2px solid #1890ff' : 'none' }}
                onClick={() => setBgImageUrl(url)}
              />
            ))}
          </Space>
        </div>
      )}

      {/* 历史背景图选择区 */}
      {showHistoryBgs && (
        <div className={styles.bgSelector}>
          <h4>历史背景图</h4>
          {loading ? (
            <div>加载中...</div>
          ) : (
            <Space wrap>
              {historyBgs.map(bg => (
                <div key={bg.url} style={{ position: 'relative' }}>
                  <Image
                    src={bg.url}
                    alt="history-bg"
                    width={120}
                    preview={false}
                    style={{ cursor: 'pointer', border: bgImageUrl === bg.url ? '2px solid #1890ff' : 'none' }}
                    onClick={() => setBgImageUrl(bg.url)}
                  />
                </div>
              ))}
            </Space>
          )}
        </div>
      )}
      
    </div>
  );
};

export default BgSettings;