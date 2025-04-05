import React from 'react';
import { EditorContent } from '@tiptap/react';
import PropTypes from 'prop-types';
import { Skeleton } from 'antd';
import styles from './index.module.scss';

const ContentArea = ({ editor }) => {
  // 如果 editor 尚未初始化，可以显示 loading 或 null
  if (!editor) {
    <Skeleton active />
  }

  return (
    <div className={styles.contentAreaWrapper}>
      {/* EditorContent 会使用 useEditor 中定义的 editorProps 应用样式类 */}
      <EditorContent editor={editor} className={styles.contentArea}/>
    </div>
  );
};

ContentArea.propTypes = {
  // 明确 editor prop 是必须的，并且是 TipTap editor 实例类型 (虽然 JS 无法严格检查类型)
  editor: PropTypes.object,
};

export default ContentArea;