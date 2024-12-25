import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, 
  Select, Popconfirm, 
  Tooltip} from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN' // 引入汉化包 时间选择器显示中文
import moment from 'moment';

// 导入资源
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '/src/assets/error.png'
import { useChannels } from '../../utils/hooks/useChannels'
import { delArticleAPI, getArticleListAPI } from '/src/apis/article'
import './index.scss'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const navigate = useNavigate()
  const { channelList } = useChannels()

  // 准备列数据
  // 定义状态枚举
  const status = {
    1: <Tag color='warning'>待审核</Tag>,
    2: <Tag color='success'>审核通过</Tag>,
  }
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      key: 'cover',
      width: 100,
      render: cover => {
        // return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
        return <img src={img404} width={80} height={60} alt="" />
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
      // data - 后端返回的状态status。data === 1 => 待审核；data === 2 => 审核通过
      render: data => status[data]
    },
    {
      title: '分类',
      dataIndex: 'channelId',
      key: 'channelId',
      width: 75,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 150,
      ellipsis: true,
      render: (text) => {
        return <Tooltip title={text} placement='top'>
          {text}
        </Tooltip>
      }
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 175,
      // 格式化时间显示
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')  
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
              onClick={() => navigate(`/publish?id=${data.id}`)} 
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
      endPubdate: formValue.date? formValue.date[1].format('YYYY-MM-DD') : ''
    })
    // 4. 重新拉取文章列表 + 渲染table逻辑重复的 - 复用
    // reqData依赖项发生变化 重复执行副作用函数 
  }

  // 获取文章列表
  const [list, setArticlesList] = useState([])
  const [count, setCount] = useState(0)
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
    console.log('page change to: '+currentPage+'page size change to: '+pageSize)
    // 修改参数依赖项 引发数据的重新获取列表渲染
    setReqData({
      ...reqData,
      currentPage,
      pageSize
    })
  }

  // 删除
  const onConfirm = async (data) => {
    console.log('删除点击了', data)
    await delArticleAPI(data.id)
    setReqData({
      ...reqData
    })
  }

  return (
    <div>
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: '文章列表' },
          ]} />
        }
        style={{ marginBottom: 20 }}
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
              showSearch
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              {channelList.map(item => <Option 
                key={item.id} value={item.id}>{item.channel}</Option>)}
            </Select>
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