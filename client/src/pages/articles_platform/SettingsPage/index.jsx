// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  PictureOutlined,
} from '@ant-design/icons';

import { BgImageUploader } from '../../../components/common/Upload';
import styles from './index.module.scss';

const { Sider, Content } = Layout;

const ArticlesPlatformSettingsPage = () => {
  const [selectedMenu, setSelectedMenu] = useState('account'); // 默认选中账号信息
  const [bgImageUrl, setBgImageUrl] = useState(null)

  // 菜单项
  const menuItems = [
    {
      key: 'account',
      icon: <UserOutlined />,
      label: '账号信息',
    },
    {
      key: 'personalization',
      icon: <SettingOutlined />,
      label: '个性化',
      children: [
        {
          key: 'bg',
          icon: <PictureOutlined />,
          label: '更换首页背景',
        },
      ],
    },
  ];

  // 渲染右侧内容
  const renderContent = () => {
    switch (selectedMenu) {
      case 'account':
        return <div>账号信息设置</div>;
      case 'bg':
        return (
          <div className={styles.bgSettings}>
            <h2>更换首页背景</h2>
            <div className={styles.bgUploaderContainer}>
              <BgImageUploader
                bgImageUrl={bgImageUrl}
                onBgChange={setBgImageUrl}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout className={styles.settingsLayout}>
      {/* 左侧菜单 */}
      <Sider width={200} theme="light">
        <Menu
          mode="inline"
          defaultSelectedKeys={[selectedMenu]}
          defaultOpenKeys={['personalization']}
          items={menuItems}
          onSelect={({ key }) => setSelectedMenu(key)}
        />
      </Sider>

      {/* 右侧内容区 */}
      <Content className={styles.settingsContent}>
        {renderContent()}
      </Content>
    </Layout>
  );
};

export default ArticlesPlatformSettingsPage;