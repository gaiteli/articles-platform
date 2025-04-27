import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  Card,
  Table,
  Breadcrumb,
  Form,
  Tag,
  Button,
  Radio,
  Input,
  Space,
  message,
  Tooltip
} from 'antd'
import { StopOutlined, UndoOutlined } from '@ant-design/icons'
import img404 from '/src/assets/error.png'
import './index.scss'

import moment from 'moment';
import { BASE_URL } from '../../constants'
import { getAllUsersInfoAPI, updateUserInfoAPI } from '/src/apis/user'

const User = () => {
  const navigate = useNavigate()

  // 准备列数据
  const GENDER = {
    0: <Tag color='success'>男</Tag>,
    1: <Tag color='warning'>女</Tag>,
    99: <Tag color='error'>未填写</Tag>,
  }
  const STATUS = {
    active: <Tag color='success'>正常</Tag>,
    inactive: <Tag color='warning'>未激活</Tag>,
    banned: <Tag color='error'>已封禁</Tag>,
  }
  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 100,
      render: avatar => {
        // return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
        return <img src={img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 150
    },
    {
      title: '账户名',
      dataIndex: 'account',
      key: 'account',
      width: 200,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 75,
      render: data => GENDER[data]
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 75,
      // data - 后端返回的状态status。data === 1 => 待审核；data === 2 => 审核通过
      render: data => STATUS[data]
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 175,
      // 格式化时间显示
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 175,
      // 格式化时间显示
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      render: (value, record, index) => {
        console.log(record);
        console.log(index);
        return (
          <Space size="middle">
            {record.status === 'banned' ? (
              <Tooltip title="解除封禁" placement='top'>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<UndoOutlined />}
                  onClick={() => onClickBanUser(record.id, {status: 'active'})}
                />
              </Tooltip>
            ) : (
              <Tooltip title="封禁用户" placement='top'>
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  icon={<StopOutlined />}
                  onClick={() => onClickBanUser(record.id, {status: 'banned'})}
                />
              </Tooltip>
            )}
          </Space>
        )
      }
    }
  ]

  // 用户表获取
  const [list, setUsersList] = useState([])
  const [count, setCount] = useState(0)
  const loadUsersInfo = async () => {
    const res = await getAllUsersInfoAPI(reqData)
    const usersList = res.data.users
    setUsersList(usersList)
    setCount(res.data.pagination.total)
  }

  // 禁用操作
  async function onClickBanUser(id, params) {
    await updateUserInfoAPI(id, params)
    loadUsersInfo()
  }


  // 筛选功能
  // 1. 准备参数
  const [reqData, setReqData] = useState({
    username: '',
    status: 9,
    createdAt: '',
    updatedAt: '',
    currentPage: 1,
    pageSize: 10
  })

  useEffect(() => {
    // 调用用户表获取
    loadUsersInfo()
  }, [reqData])

  // 2. 获取筛选数据
  const onFinish = (formValue) => {
    console.log('筛选数据formValue: ')
    console.dir(formValue)
    // 3. 把表单收集到数据放到参数中(不可变的方式)
    setReqData({
      ...reqData,
      username: formValue.username,
      status: formValue.status,
      // createdAt: formValue.createdAt,
    })
    // 4. 重新拉取文章列表 + 渲染table逻辑重复的 - 复用
    // reqData依赖项发生变化 重复执行副作用函数 
  }

  // 分页
  const onPageChange = (currentPage, pageSize) => {
    console.log('page change to: ' + currentPage + 'page size change to: ' + pageSize)
    // 修改参数依赖项 引发数据的重新获取列表渲染
    setReqData({
      ...reqData,
      currentPage,
      pageSize
    })
  }

  return (
    <div className="user">
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            // { title: `${articleId ? '编辑' : '发布'}文章` },
            { title: '用户管理' }
          ]}
          />
        }
        style={{ marginBottom: 10 }}
      >
        <Form
          initialValues={{ status: 9 }}
          layout='inline'
          onFinish={onFinish}
        // form={form}
        >
          <Form.Item label="用户名" name="username" className='username'>
            <Input placeholder="请输入要查询的用户名" style={{ width: 250 }} />
          </Form.Item>

          <Form.Item label="状态" name="status" >
            <Radio.Group>
              <Radio value={9}>全部</Radio>
              <Radio value={0}>正常</Radio>
              <Radio value={1}>禁用</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item className='search-button'>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      {/* 表格区域 */}
      <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
        <Table rowKey="id" columns={columns} dataSource={list} pagination={{
          total: count,
          onChange: onPageChange,
          showSizeChanger: true
        }} />
      </Card>
    </div>
  )
}

export default User