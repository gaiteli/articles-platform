import React, {useState, useEffect} from 'react'
import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
// import getUserInfo from '../../utils/getUserInfo'
import { getUserInfoAPI, removeUserInfo } from '../../apis/user'
import { useGlobals, useGlobalsDispatch } from '/src/store/globalContext'

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
]

export function GeekLayout() {
  const { token, user } = useGlobals()
  const { tokenDispatch, userDispatch } = useGlobalsDispatch()

  const navigate = useNavigate()
  const onMenuClick = (route) => {
    const path = route.key
    navigate(path)
  }

  // 反向高亮
  // 1. 获取当前路由路径
  const location = useLocation()
  const selectedkey = location.pathname==='/home' ? '/' : location.pathname

  // 触发个人用户信息action
  useEffect(() => {
    (async () => {
      // 旧api已废弃 userInfo = await getUserInfo() 
      const res = await getUserInfoAPI()
      const user = res.data.user
      console.log('layout get user'+user);
      await userDispatch({
        type: 'set',
        user: user
      })
    })()
  }, [userDispatch])

  // 退出登录确认回调
  const onConfirm = () => {
    removeUserInfo(tokenDispatch, userDispatch)
    navigate('/signin')
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{user.username}</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" 
              onConfirm={onConfirm}>
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={['1']}
            selectedKeys={selectedkey}
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