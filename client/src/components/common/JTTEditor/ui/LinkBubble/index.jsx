import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Input, Button, Form } from 'antd';
import styles from './index.module.scss';

const LinkBubble = ({ editor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isNewLink, setIsNewLink] = useState(false);

  // 编辑器指令
  const openMenu = useCallback(({ href, text: initialText, isNew }) => {
    console.log('open Menu callback');
    setUrl(href || 'https://');
    setText(initialText || '');
    setIsNewLink(isNew);
    setIsVisible(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!editor || !editor.storage.JttLink) {
      return;
    }
    editor.storage.JttLink.openMenu = openMenu;
    editor.storage.JttLink.closeMenu = closeMenu;

    return () => {
      if (editor.storage.JttLink) {
        // Reset on unmount or editor change if needed
        editor.storage.JttLink.openMenu = () => { };
        editor.storage.JttLink.closeMenu = () => { };
      }
    }
  }, [editor, openMenu, closeMenu]);

  // 保存
  const handleSave = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().setLinkWithOptions({ href: url, text: text, isNew: isNewLink }).run();
  }, [editor, url, text, isNewLink]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <Modal
        title={isNewLink ? 'Insert Link' : 'Edit Link'}
        open={isVisible}
        onCancel={closeMenu}
        footer={[
          <Button key="cancel" onClick={closeMenu}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
        maskClosable={false}
      >
        <Form layout="vertical" onFinish={handleSave}>
          {isNewLink && (
            <Form.Item label="Text" required>
              <Input
                placeholder="Enter display text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus // Focus this first when inserting new link
              />
            </Form.Item>
          )}

          <Form.Item label="URL" required>
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus={!isNewLink}
              type="url"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default LinkBubble;