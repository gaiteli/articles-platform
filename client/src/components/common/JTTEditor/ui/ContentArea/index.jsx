import React from 'react';
import { EditorContent } from '@tiptap/react';
import { useEditorContext } from '../../core/EditorContext';
import styles from './index.module.scss';
import PropTypes from 'prop-types';

const ContentArea = ({ className = '' }) => {
  const editor = useEditorContext();

  if (!editor) {
    return <div className={`${styles.contentArea} ${styles.loading} ${className}`}></div>;
  }

  return (
    <EditorContent editor={editor} className={`${styles.contentArea} ${className}`} />
  );
};

ContentArea.propTypes = {
  className: PropTypes.string,
};

export default ContentArea;