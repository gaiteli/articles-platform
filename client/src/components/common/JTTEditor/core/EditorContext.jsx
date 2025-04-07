import React, { createContext, useContext } from 'react';

const EditorContext = createContext(null);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorContext must be used within an EditorProvider!');
  }
  return context;
};

export const EditorProvider = ({ children, editor }) => {
  return (
    <EditorContext.Provider value={editor}>
      {children}
    </EditorContext.Provider>
  );
};