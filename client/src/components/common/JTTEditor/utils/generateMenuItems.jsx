
import React from 'react';
import {
  BoldOutlined,
  CheckSquareOutlined,
  CodeFilled,
  CodeOutlined,
  HighlightOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  PictureOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UndoOutlined,
  UnorderedListOutlined,
  VerticalLeftOutlined,
} from '@ant-design/icons';

// --- Button Handlers ---
// Example: Image - you'll need a way to get the URL
const addImage = () => {
  const url = window.prompt('Enter Image URL:');
  if (url) {
    editor.chain().focus().setImage({ src: url }).run();
  }
};

// Example: Link
const setLink = () => {
  const previousUrl = editor.getAttributes('link').href;
  const url = window.prompt('Enter URL:', previousUrl);

  // cancelled
  if (url === null) {
    return;
  }

  // empty
  if (url === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  // update link
  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};

const allMenuItems = {
  // mark
  bold: {
    title: 'Bold (Ctrl+B)',
    icon: <BoldOutlined />,
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive('bold'),
    disabled: (editor) => !editor.can().chain().focus().toggleBold().run(),
  },
  italic: {
    title: 'Italic (Ctrl+I)',
    icon: <ItalicOutlined />,
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive('italic'),
    disabled: (editor) => !editor.can().chain().focus().toggleItalic().run(),
  },
  underline: {
    title: 'Underline (Ctrl+U)',
    icon: <UnderlineOutlined />,
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive('underline'),
    disabled: (editor) => !editor.can().chain().focus().toggleUnderline().run(),
  },
  strikethrough: {
    title: 'strikethrough (Ctrl+)',
    icon: <StrikethroughOutlined />,
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive('strikethrough'),
    disabled: (editor) => !editor.can().chain().focus().toggleStrike().run(),
  },
  highlight: {
    title: 'highlight (Ctrl+)',
    icon: <HighlightOutlined />,
    action: (editor) => editor.chain().focus().toggleHighlight().run(),
    isActive: (editor) => editor.isActive('highlight'),
    disabled: (editor) => !editor.can().chain().focus().toggleHighlight().run(),
  },
  code: {
    title: 'code (Ctrl+)',
    icon: <CodeOutlined />,
    action: (editor) => editor.chain().focus().toggleCode().run(),
    isActive: (editor) => editor.isActive('code'),
    disabled: (editor) => !editor.can().chain().focus().toggleCode().run(),
  },
  // font
  heading2: {
    title: 'Heading 2',
    icon: 'H2',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
    disabled: (editor) => !editor.can().chain().focus().toggleHeading({ level: 2 }).run(),
  },
  paragraph: {
    icon: 'p',
    title: 'Paragraph',
    action: (editor) => editor.chain().focus().setParagraph().run(),
    isActive: (editor) => editor.isActive('paragraph'),
  },
  blockquote: {
    title: 'Blockquote',
    icon: <VerticalLeftOutlined />,
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote'),
    disabled: (editor) => !editor.can().chain().focus().toggleBlockquote().run(),
  },
  bulletList: {
    title: 'Bullet List',
    icon: <UnorderedListOutlined />,
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
    disabled: (editor) => !editor.can().chain().focus().toggleBulletList().run(),
  },
  orderedList: {
    title: 'Ordered List',
    icon: <OrderedListOutlined />,
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
    disabled: (editor) => !editor.can().chain().focus().toggleOrderedList().run(),
  },
  checkedList: {
    title: 'Task List',
    icon: <CheckSquareOutlined />,
    action: (editor) => editor.chain().focus().toggleTaskList().run(),
    isActive: (editor) => editor.isActive('taskList'),
    disabled: (editor) => !editor.can().chain().focus().toggleTaskList().run(),
  },
  codeBlock: {
    title: 'Code Block',
    icon: <CodeFilled />,
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock'),
    disabled: (editor) => !editor.can().chain().focus().toggleCodeBlock().run(),
  },
  image: {
    title: 'Insert Image',
    icon: <PictureOutlined />,
    action: addImage,
    disabled: (editor) => !editor.can().setImage,
  },
  link: {
    title: 'Set Link',
    icon: <LinkOutlined />,
    action: setLink,
    isActive: (editor) => editor.isActive('link'),
    disabled: (editor) => !editor.can().setLink,
  },
  linkRemove: {
    title: 'Remove Link',
    icon: <LinkOutlined/>,
    action: (editor) => editor.chain().focus().unsetLink().run(),
    isActive: (editor) => editor.isActive('link'),
    disabled: (editor) => !editor.can().unsetLink,
  },
  undo: {
    title: 'Undo (Ctrl+Z)',
    icon: <UndoOutlined />,
    action: (editor) => editor.chain().focus().undo().run(),
    isActive: (editor) => editor.can().undo(),
    disabled: (editor) => !editor.can().undo(),
  },
  redo: {
    title: 'Redo (Ctrl+Y)',
    icon: <RedoOutlined />,
    action: (editor) => editor.chain().focus().redo().run(),
    isActive: (editor) => editor.can().redo(),
    disabled: (editor) => !editor.can().redo(),
  },
  separator: {
    type: 'separator',
  },
};

const simplePreset = [
  allMenuItems.bold,
  allMenuItems.italic,
  allMenuItems.separator,
];

const defaultPreset = [
  ...simplePreset,
  allMenuItems.underline,
  allMenuItems.strikethrough,
  allMenuItems.highlight,
  allMenuItems.code,
];

const articlePreset = [
  ...defaultPreset,
  allMenuItems.heading2,
  allMenuItems.paragraph,
  allMenuItems.blockquote,
  allMenuItems.bulletList,
  allMenuItems.orderedList,
  allMenuItems.checkedList,
  allMenuItems.codeBlock,
  allMenuItems.image,
  allMenuItems.link,
  allMenuItems.undo,
  allMenuItems.redo,
];

const presets = {
  simple: simplePreset,
  default: defaultPreset,
  article: articlePreset
};

export function generateMenuItems(preset = 'default') {
  return presets[preset] || presets.default;
}