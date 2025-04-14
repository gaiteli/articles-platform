import React, { useState, useRef } from 'react';
import { Popover, Input, Button, Form, message, Tooltip } from 'antd';
import styles from './index.module.scss';

const VideoBubble = ({ editor, icon, tooltip, buttonClassName, disabled, action }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.resetFields();
    }
  };

  const onFinish = (values) => {
    const { url } = values;
    if (!editor || !url) return;

    const success = editor.chain().focus().setJttVideo({ src: url }).run();

    if (success) {
      message.success('视频插入成功！');
      setOpen(false);
      form.resetFields();
    } else {
      message.error('无效或不允许的视频 URL，请检查。');
    }
  };

  const onCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  if (!editor) {
    return null
  }

  const popoverContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className={styles.videoForm}
      autoComplete="off"
    >
      <Form.Item
        name="url"
        label="视频 URL"
        rules={[
          { required: true, message: '请输入视频 URL' },
          { type: 'url', warningOnly: true, message: '请输入有效的 URL 格式' },
        ]}
      >
        <Input defaultValue='https://' />
      </Form.Item>
      <Form.Item className={styles.formActions}>
        <Button size="small" onClick={onCancel} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button type="primary" size="small" htmlType="submit">
          插入
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <Popover
      content={popoverContent}
      title="插入视频"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottom"
      getPopupContainer={() => document.body}
    >
      <button
        key={tooltip}
        title={tooltip || '插入视频'}
        type="button"
        onClick={action}
        className={buttonClassName}
        disabled={disabled}
      >
        {icon}
      </button>
    </Popover>
  );
};

export default VideoBubble;