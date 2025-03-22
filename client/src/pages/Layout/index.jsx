import React, { useState, useEffect, useContext } from 'react'
import { Layout, Menu, Popconfirm, Dropdown, Space } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LinkOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getUserInfoAPI } from '../../apis/user'
import { removeToken } from '../../utils/token'
import { AuthContext } from '/src/store/authContext'

const { Header, Sider } = Layout
const items = [
  {
    label: '首页',
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: '文章管理',
    key: '/article',
    icon: <DiffOutlined />,
  },
  {
    label: '创建文章',
    key: '/publish',
    icon: <EditOutlined />,
  },
  {
    label: '附件管理',
    key: '/attachment',
    icon: <LinkOutlined />
  },
  {
    label: '分类管理',
    key: '/channel',
    icon: <LinkOutlined />
  },
  {
    label: '用户管理',
    key: '/user',
    icon: <UserOutlined />,
  },
]
const userItems = [
  {
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
    key: '0',
  },
  {
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item
      </a>
    ),
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: '3rd menu item（disabled）',
    key: '3',
    disabled: true,
  },
];

export function GeekLayout() {
  const { user, removeAuth }  = useContext(AuthContext)
  const location = useLocation()
  const [currentMenuKey, setCurrentMenuKey] = useState('')

  const navigate = useNavigate()
  const onMenuClick = (route) => {
    const path = route.key
    setCurrentMenuKey(path)
    navigate('.'+path)  // 相对路径
  }

  // 根据url路径修改菜单高亮项
  useEffect(() => {
    const pathname = location.pathname
    setCurrentMenuKey(pathname === '/admin' ? '/' : pathname.substring(pathname.lastIndexOf('/')))
  })

  // 触发个人用户信息action
  useEffect(() => {
    (async () => {
      const res = await getUserInfoAPI()
      const user = res.data.user
      console.log('layout get user' + user);
    })()
  }, [])

  // 退出登录确认回调
  const onConfirm = () => {
    removeToken()
    removeAuth()
    navigate('/login')
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">
            <Dropdown menu={{ items:userItems }}>{/* 需要写全，不能省略items： */}
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {user.username}
                  {/* <span>&gt;</span> */}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消"
              onConfirm={onConfirm}>
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={'12vw'} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={["/"]}
            selectedKeys={[currentMenuKey]}
            onClick={onMenuClick}
            items={items}
            style={{ height: '100%', borderRight: 0 }}></Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由的出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}