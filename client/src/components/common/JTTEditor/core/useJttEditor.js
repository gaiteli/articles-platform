import { useEditor } from '@tiptap/react';
import { getExtensions } from './extensionsConfig';
import { useEffect } from 'react';

export function useJttEditor({
  preset = 'default',
  initialContent = '',
  onUpdate,
  onCreate,
  editorProps = {},
  editable = true,
  ...rest
}) {
  const extensions = getExtensions(preset); // 获取对应预设的扩展

  const editor = useEditor({
    extensions,
    content: initialContent,
    editable,
    editorProps: {
      ...editorProps,
    },
    onUpdate: onUpdate,
    onCreate: onCreate,
    ...rest,
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return editor;
}