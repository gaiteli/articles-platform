import React from 'react';
import { EditorContent } from '@tiptap/react';
import PropTypes from 'prop-types';

const ContentArea = ({ editor, className = '' }) => {

  if (!editor) {
    return <div></div>;
  }

  return (
    <EditorContent editor={editor} className={`${className}`} />
  );
};

ContentArea.propTypes = {
  className: PropTypes.string,
};

export default ContentArea;