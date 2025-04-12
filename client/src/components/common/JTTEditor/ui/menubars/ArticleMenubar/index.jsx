import React from 'react';
import {
  BoldOutlined,
  CheckSquareOutlined,
  CodeFilled,
  CodeOutlined,
  DashOutlined,
  DisconnectOutlined,
  HighlightOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  PictureFilled,
  PictureOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UndoOutlined,
  UnorderedListOutlined,
  VerticalLeftOutlined,
} from '@ant-design/icons';
import styles from './index.module.scss'

const ArticleMenubar = ({ editor }) => {

  const items = [
    // mark
    {
      title: 'Bold (Ctrl+B)',
      icon: <BoldOutlined />,
      action: (editor) => editor.chain().focus().toggleBold().run(),
      isActive: (editor) => editor.isActive('bold'),
      disabled: (editor) => !editor.can().chain().focus().toggleBold().run(),
    },
    {
      title: 'Italic (Ctrl+I)',
      icon: <ItalicOutlined />,
      action: (editor) => editor.chain().focus().toggleItalic().run(),
      isActive: (editor) => editor.isActive('italic'),
      disabled: (editor) => !editor.can().chain().focus().toggleItalic().run(),
    },
    {
      title: 'Underline (Ctrl+U)',
      icon: <UnderlineOutlined />,
      action: (editor) => editor.chain().focus().toggleUnderline().run(),
      isActive: (editor) => editor.isActive('underline'),
      disabled: (editor) => !editor.can().chain().focus().toggleUnderline().run(),
    },
    {
      title: 'strikethrough (Ctrl+Shift+S)',
      icon: <StrikethroughOutlined />,
      action: (editor) => editor.chain().focus().toggleStrike().run(),
      isActive: (editor) => editor.isActive('strikethrough'),
      disabled: (editor) => !editor.can().chain().focus().toggleStrike().run(),
    },
    {
      title: 'highlight (Ctrl+Shift+H)',
      icon: <HighlightOutlined />,
      action: (editor) => editor.chain().focus().toggleHighlight().run(),
      isActive: (editor) => editor.isActive('highlight'),
      disabled: (editor) => !editor.can().chain().focus().toggleHighlight().run(),
    },
    {
      title: 'code (Ctrl+E)',
      icon: <CodeOutlined />,
      action: (editor) => editor.chain().focus().toggleCode().run(),
      isActive: (editor) => editor.isActive('code'),
      disabled: (editor) => !editor.can().chain().focus().toggleCode().run(),
    },
    {
      type: 'separator',
    },
    // font
    {
      title: 'Heading 2',
      icon: 'H2',
      action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: (editor) => editor.isActive('heading', { level: 2 }),
      disabled: (editor) => !editor.can().chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      title: 'subscript (Ctrl+,)',
      icon: 'x-',
      action: (editor) => editor.chain().focus().toggleSubscript().run(),
      isActive: (editor) => editor.isActive('subscript'),
      disabled: (editor) => !editor.can().chain().focus().toggleSubscript().run(),
    },
    {
      title: 'superscript (Ctrl+.)',
      icon: 'X+',
      action: (editor) => editor.chain().focus().toggleSuperscript().run(),
      isActive: (editor) => editor.isActive('superscript'),
      disabled: (editor) => !editor.can().chain().focus().toggleSuperscript().run(),
    },
    {
      type: 'separator',
    },
    // （只有set方法没有toggle以及disabled
    {
      icon: 'P',
      title: 'Paragraph',
      action: (editor) => editor.chain().focus().setParagraph().run(),
      isActive: (editor) => editor.isActive('paragraph'),
    },
    {
      title: 'Horizontal Line',
      icon: <DashOutlined />,
      action: (editor) => editor.chain().focus().setHorizontalRule().run(),
      isActive: (editor) => editor.isActive('codeBlock'),
    },
    {
      type: 'separator',
    },
    // list & block
    {
      title: 'Blockquote (Ctrl+Shift+B)',
      icon: <VerticalLeftOutlined />,
      action: (editor) => editor.chain().focus().toggleBlockquote().run(),
      isActive: (editor) => editor.isActive('blockquote'),
      disabled: (editor) => !editor.can().chain().focus().toggleBlockquote().run(),
    },
    {
      title: 'Ordered List (Ctrl+Shift+7)',
      icon: <OrderedListOutlined />,
      action: (editor) => editor.chain().focus().toggleOrderedList().run(),
      isActive: (editor) => editor.isActive('orderedList'),
      disabled: (editor) => !editor.can().chain().focus().toggleOrderedList().run(),
    },
    {
      title: 'Bullet List (Ctrl+Shift+8)',
      icon: <UnorderedListOutlined />,
      action: (editor) => editor.chain().focus().toggleBulletList().run(),
      isActive: (editor) => editor.isActive('bulletList'),
      disabled: (editor) => !editor.can().chain().focus().toggleBulletList().run(),
    },
    {
      title: 'Task List (Ctrl+Shift+9)',
      icon: <CheckSquareOutlined />,
      action: (editor) => editor.chain().focus().toggleTaskList().run(),
      isActive: (editor) => editor.isActive('taskList'),
      disabled: (editor) => !editor.can().chain().focus().toggleTaskList().run(),
    },
    {
      title: 'Code Block (Control+Alt+C)',
      icon: <CodeFilled />,
      action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
      isActive: (editor) => editor.isActive('codeBlock'),
      disabled: (editor) => !editor.can().chain().focus().toggleCodeBlock().run(),
    },
    {
      type: 'separator',
    },
    // function
    {
      title: 'Upload Image',
      icon: <PictureOutlined />,
      action: (editor) => editor.commands.uploadImage(editor),
      isActive: () => false, // 图片上传按钮不需要active状态
      disabled: (editor) => !editor.isEditable,
    },
    {
      title: 'Set/Edit Link',
      icon: <LinkOutlined />,
      action: (editor) => editor.chain().focus().openLinkEditor().run(),
      isActive: (editor) => editor.isActive('JttLink'),
      disabled: (editor) => !editor.isEditable,
    },
    {
      title: 'Unset Link',
      icon: <DisconnectOutlined style={{ filter: 'grayscale(1)' }} />,
      action: (editor) => editor.chain().focus().unsetLink().run(),
      disabled: (editor) => !editor.isActive('JttLink'),
    },
    {
      type: 'separator',
    },
    {
      title: 'Undo (Ctrl+Z)',
      icon: <UndoOutlined />,
      action: (editor) => editor.chain().focus().undo().run(),
      isActive: (editor) => editor.can().undo(),
      disabled: (editor) => !editor.can().undo(),
    },
    {
      title: 'Redo (Ctrl+Y)',
      icon: <RedoOutlined />,
      action: (editor) => editor.chain().focus().redo().run(),
      isActive: (editor) => editor.can().redo(),
      disabled: (editor) => !editor.can().redo(),
    },
  ]

  return (
    <div className={styles.menuBar}>
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return <span key={`separator-${index}`} className={styles.separator} />
        }

        // Check if action requires editor focus; chain it if needed.
        const action = () => item.action(editor); // Assuming item.action handles focus chaining if needed

        return (
          <button
            key={item.title}
            title={item.title}
            type="button"
            onClick={action}
            className={`${styles.menuItem} ${item.isActive && item.isActive(editor) ? styles.isActive : ''}`}
            disabled={!editor.isEditable || (item.disabled && item.disabled(editor))}
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
}

export default ArticleMenubar