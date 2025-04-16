// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  PictureOutlined,
  FormatPainterOutlined,
} from '@ant-design/icons';
const { Sider, Content } = Layout;

import styles from './index.module.scss';
import ThemeSettings from './ThemeSettings';
import BgSettings from './BgSettings';

const ArticlesPlatformSettingsPage = () => {
  const [selectedMenu, setSelectedMenu] = useState('account'); // 默认选中账号信息

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
          key: 'theme',
          icon: <FormatPainterOutlined />,
          label: '定制主题',
        },
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
      case 'theme':
        return <ThemeSettings />
      case 'bg':
        return <BgSettings />
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