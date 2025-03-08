import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { getAttachmentsAPI, deleteAttachmentAPI } from '/src/apis/articles_platform/attachment';
import styles from './index.module.scss';
import { OSS_BASE_URL } from '/src/constants';

const Attachments = () => {
  const [attachments, setAttachments] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  // 获取附件列表
  const fetchAttachments = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getAttachmentsAPI({
        currentPage: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
      });
      console.log(res);
      console.log('请求参数:', { currentPage: params.current || pagination.current, pageSize: params.pageSize || pagination.pageSize });
      setAttachments(res.data.attachments);
      setPagination({
        ...pagination,
        total: res.data.pagination.total,
        current: res.data.pagination.currentPage,
        pageSize: res.data.pagination.pageSize,
      });
    } catch (error) {
      console.error('Failed to fetch attachments:', error);
      message.error('获取附件列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载附件列表
  useEffect(() => {
    fetchAttachments();
  }, []);

  // 删除附件
  const handleDelete = async (id) => {
    try {
      await deleteAttachmentAPI(id);
      message.success('删除附件成功');
      fetchAttachments(); // 重新加载附件列表
    } catch (error) {
      console.error('Failed to delete attachment:', error);
      message.error('删除附件失败');
    }
  };

  // 分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchAttachments(pagination);
  };

  // 表格列定义
  const columns = [
    {
      title: '文件 ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '文件',
      dataIndex: 'fullpath',
      key: 'fullpath',
      width: 150,
      render: (filepath) => (
        <img
          src={OSS_BASE_URL + '/' + filepath}
          alt="附件"
          style={{ width: 100, height: 60, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '类型',
      dataIndex: 'mimetype',
      key: 'mimetype',
      width: 100,
      render: (filetype) => filetype, // 显示为大写.toUpperCase()
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (filesize) => {
        const sizeInMB = (filesize / 1024 / 1024).toFixed(2); // 转换为 MB
        return `${sizeInMB} MB`;
      },
    },
    {
      title: '文件名',
      dataIndex: 'filename',
      key: 'filename',
    },
    {
      title: '上传用户',
      dataIndex: 'user',
      key: 'user',
      render: (user) => user.username,
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="确定要删除该附件吗？"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className={styles.attachmentsPage}>
      {/* 表格区域 */}
      <Card >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={attachments}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default Attachments;