import { useEffect, useState, useContext } from 'react';
import { Button, Space, Image, Checkbox } from 'antd';
import BgImageUploader from '../../../components/common/Upload/extensions/BgImageUploader';
import { getMyAttachmentsAPI } from '/src/apis/articles_platform/attachment'
import styles from './BgSettings.module.scss';
import { AuthContext } from '/src/store/AuthContext';
import { ExclamationCircleOutlined, QuestionCircleFilled } from '@ant-design/icons';

// 默认背景图列表
const DEFAULT_BGS = [
  "/src/assets/articles_platform/home_pic.png",
  "/articles_platform/front_bg/plain01.jpg",
  "/articles_platform/front_bg/plain02.jpg",
  "/articles_platform/front_bg/galaxy.jpg",
];
const PICTURE_LOADING_FAILURE = "/src/assets/articles_platform/picture-loading-failure.svg"

const BgSettings = () => {
  const { user } = useContext(AuthContext);
  const [bgImageUrl, setBgImageUrl] = useState(null);
  const [showDefaultBgs, setShowDefaultBgs] = useState(false);
  const [showHistoryBgs, setShowHistoryBgs] = useState(false);
  const [historyBgs, setHistoryBgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bgBlurEnabled, setBgBlurEnabled] = useState(localStorage.getItem('bgBlurEnabled') || false)
  console.log(localStorage.getItem('bgBlurEnabled'));
  useEffect(() => {
    setBgImageUrl(user.bgImageUrl)
  }, [])

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

  // 切换高斯模糊效果
  const toggleBlur = (e) => {
    const isChecked = e.target.checked;
    setBgBlurEnabled(isChecked)
    localStorage.setItem('bgBlurEnabled', isChecked);
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
      <p className={styles.prompt}><ExclamationCircleOutlined /> 双击上面图片可以上传并应用您喜爱的背景图</p>
      <hr style={{ marginBottom: '12px', border: '2px solid var(--border-color)' }}></hr>

      {/* 操作按钮组 */}
      <div className={styles.actionButtonsContainer}>
        <p className={styles.prompt}><QuestionCircleFilled /> 不想上传 or 想使用之前的背景？</p>
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
          {/* 高斯模糊开关 */}
          <Checkbox onChange={toggleBlur} checked={bgBlurEnabled}>
            启用背景模糊效果
          </Checkbox>
        </Space>
      </div>

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
                width={256}
                height={144}
                preview={false}
                fallback={PICTURE_LOADING_FAILURE}
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
                    width={256}
                    height={144}
                    preview={false}
                    fallback={PICTURE_LOADING_FAILURE}
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