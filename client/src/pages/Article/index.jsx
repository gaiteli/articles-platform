import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Card, Breadcrumb, Form, Button, Radio, DatePicker,
  Select, Popconfirm,
  Tooltip
} from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN' // 引入汉化包 时间选择器显示中文
import moment from 'moment';

// 导入资源
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons'
import img404 from '/src/assets/error.png'
import { useChannels } from '../../utils/hooks/useChannels'
import { delArticleAPI, getArticleListAPI } from '/src/apis/article'
import './index.scss'
import { reviewArticleAPI } from '/src/apis/article';

const { RangePicker } = DatePicker

const Article = () => {
  const navigate = useNavigate()
  const { channelList } = useChannels()
  const [list, setArticlesList] = useState([])
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false);    // antd popconfirm
  const [confirmLoading, setConfirmLoading] = useState(false); // antd popconfirm loading

  // 准备列数据
  // 定义状态枚举
  const status = {
    0: <Tag color='warning'>待审核</Tag>,
    1: <Tag color='success'>审核通过</Tag>,
    2: <Tag color='error'>拒绝/禁用</Tag>
  }
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      key: 'cover',
      width: 100,
      render: cover => {
        return (
          <img
            src={cover || img404}   // 如果获取不到封面图片，显示默认图片
            alt="cover"
            style={{ width: '100%' }}
            onError={(e) =>
              e.target.src = img404}
          />
        )
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '作者',
      dataIndex: 'userId',
      key: 'userId',
      width: 75
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      // data - 后端返回的状态status。data：0 待审核；data：1 审核通过；data：2 审核不通过
      render: data => status[data]
    },
    {
      title: '分类',
      dataIndex: 'channelId',
      key: 'channelId',
      width: 75,
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      // 格式化时间显示
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '阅读',
      dataIndex: 'readCount',
      key: 'readCount',
      width: 60,
    },
    {
      title: '评论',
      dataIndex: 'commentCount',
      key: 'commentCount',
      width: 60,
    },
    {
      title: '点赞',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 60,
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />}
              onClick={() => navigate(`../publish?id=${data.id}`)}
            />
            <Popconfirm
              title="删除文章"
              description="确认要删除当前文章吗?"
              onConfirm={() => onConfirm(data)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
            <Popconfirm
              title="是否通过该文章？"
              description={
                <a onClick={() => navigate(`/articles/${data.id}`)}>
                  <p>点击此链接浏览文章详情👇</p>
                  <p>标题：<u>{data.title}</u></p>
                </a>
              }
              okText="通过"
              cancelText="拒绝/禁用"
              onConfirm={() => handleAudit(data.id, 1)}
              onCancel={() => handleAudit(data.id, 2)}
              overlayStyle={{ width: 250 }}
            >
              <Button type="primary" shape='circle' icon={<LockOutlined />}
                onClick={() => setOpen(true)} />
            </Popconfirm>
          </Space>
        )
      }
    }
  ]


  // 筛选功能
  // 1. 准备参数
  const [reqData, setReqData] = useState({
    status: 0,
    channelId: '',
    beginPubdate: '',
    endPubdate: '',
    currentPage: 1,
    pageSize: 10
  })

  // 2. 获取筛选数据
  const onFinish = (formValue) => {
    console.log('筛选数据formValue: ')
    console.dir(formValue)
    // 3. 把表单收集到数据放到参数中(不可变的方式)
    setReqData({
      ...reqData,
      channelId: formValue.channel_id,
      status: formValue.status,
      beginPubdate: formValue.date ? formValue.date[0].format('YYYY-MM-DD') : '',
      endPubdate: formValue.date ? formValue.date[1].format('YYYY-MM-DD') : ''
    })
    // 4. 重新拉取文章列表 + 渲染table逻辑重复的 - 复用
    // reqData依赖项发生变化 重复执行副作用函数 
  }

  // 获取文章列表
  useEffect(() => {
    (async () => {
      const res = await getArticleListAPI(reqData)
      const articlesList = res.data.articles
      setArticlesList(articlesList)
      setCount(res.data.pagination.total)
    })()
  }, [reqData])

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

  // 删除
  async function onConfirm(data) {
    console.log('删除点击了', data)
    await delArticleAPI(data.id)
    setReqData({
      ...reqData
    })
  }


  // 审核
  const handleAudit = async (id, status) => {
    try {
      setConfirmLoading(true);
      const res = await reviewArticleAPI(id, { status: status })
      setArticlesList(prevList => prevList.map(article =>
        article.id === id ? res.data : article
      ))
      message.success(`${status === 1 ? '审核通过' : '拒绝/禁用文章成功'}`);
    } catch (error) {
      message.error('操作失败: ' + error.message);
    } finally {
      setOpen(false);
      setConfirmLoading(false);
    }
  };


  return (
    <div>
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: '文章列表' },
          ]} />
        }
        style={{ marginBottom: 10 }}
      >
        <Form
          initialValues={{ status: 0 }}
          layout='inline'
          onFinish={onFinish}
        >
          <Form.Item label="状态" name="status" className="status">
            <Radio.Group>
              <Radio value={0}>全部</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id" className='channel'>
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
              options={channelList.map(item => { return { value: item.id, label: item.channel } })}
            />
          </Form.Item>

          {/* <Form.Item label="日期" name="date"> */}
          {/* <RangePicker locale={locale}></RangePicker> locale属性控制中文显示 */}
          {/* </Form.Item> */}

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item className="classify-button">
            <Button type="primary" htmlType="submit" >
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 表格区域 */}
      <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
        <Table rowKey="id" columns={columns} dataSource={list} pagination={{
          total: count,
          // pageSize: reqData.pageSize, 貌似可以省略
          onChange: onPageChange,
          showSizeChanger: true
        }} />
      </Card>
    </div>
  )
}

export default Article