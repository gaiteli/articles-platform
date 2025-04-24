import React from 'react';
import ArticleMenubar from '../menubars/ArticleMenubar';

const MenuBar = ({ editor, preset = 'default' }) => {
  if (!editor) {
    return <div aria-disabled="true"></div>;
  }

  switch (preset) {
    case 'article': 
      return <ArticleMenubar editor={editor} />
    default:

  }
};

export default MenuBar;