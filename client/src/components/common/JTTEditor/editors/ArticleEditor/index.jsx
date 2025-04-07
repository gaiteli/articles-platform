import React from 'react';
import PropTypes from 'prop-types';
import { useJttEditor } from '../../core/useJttEditor';
import { EditorProvider } from '../../core/EditorContext';
import MenuBar from '../../ui/MenuBar';
import ContentArea from '../../ui/ContentArea';

// 生成”文章“预设的编辑器
export const ArticleEditorProvider = ({
  initialContent,
  onUpdate,
  editorProps,
  children,
  ...rest // Pass other useEditor options
}) => {
  const editor = useJttEditor({
    preset: 'article',
    initialContent,
    onUpdate,
    editorProps,
    ...rest,
  });

  return (
    <EditorProvider editor={editor}>
      {children}
    </EditorProvider>
  );
};


export const ArticleToolbar = () => {
  return <MenuBar preset='article' />;
};

export const ArticleContent = ({ className }) => {
  return <ContentArea className={className} />;
};


// export const FullArticleEditor = ({ initialContent, onUpdate, editorProps, debounceMs, containerClassName = '', toolbarClassName = '', contentClassName = '' }) => {
//   return (
//     <ArticleEditorProvider
//       initialContent={initialContent}
//       onUpdate={onUpdate}
//       editorProps={editorProps}
//       debounceMs={debounceMs}
//     >
//       <div className={toolbarClassName}>
//         <ArticleToolbar />
//       </div>
//       <div className={contentClassName}>
//         <ArticleContent />
//       </div>
//     </ArticleEditorProvider>
//   );
// };

// FullArticleEditor.propTypes = {
//   initialContent: PropTypes.any,
//   onUpdate: PropTypes.func,
//   editorProps: PropTypes.object,
//   debounceMs: PropTypes.number,
//   containerClassName: PropTypes.string,
//   toolbarClassName: PropTypes.string,
//   contentClassName: PropTypes.string,
// };