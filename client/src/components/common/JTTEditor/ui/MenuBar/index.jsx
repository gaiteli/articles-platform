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

  // Clean separators (existing logic is fine)
  // const cleanedMenuItems = menuItems.filter((item, index, array) => {
  //   if (item.type === 'separator') {
  //     if (index === 0 || index === array.length - 1) return false;
  //     if (array[index - 1]?.type === 'separator') return false; // Check previous exists
  //   }
  //   return true;
  // });

};

export default MenuBar;