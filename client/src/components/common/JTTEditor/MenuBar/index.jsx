import { Button, Space, Tooltip } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  CodeOutlined,
  UndoOutlined,
  RedoOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const menuItems = [
    {
      icon: <BoldOutlined />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      tooltip: 'Bold'
    },
    {
      icon: <ItalicOutlined />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      tooltip: 'Italic'
    },
    {
      icon: <StrikethroughOutlined />,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      tooltip: 'Strikethrough'
    },
    {
      icon: <CodeOutlined />,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      tooltip: 'Code'
    },
    { type: 'divider' },
    {
      label: 'H1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      tooltip: 'Heading 1'
    },
    {
      label: 'H2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      tooltip: 'Heading 2'
    },
    {
      label: 'P',
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive('paragraph'),
      tooltip: 'Paragraph'
    },
    { type: 'divider' },
    {
      icon: <UnorderedListOutlined />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      tooltip: 'Bullet List'
    },
    {
      icon: <OrderedListOutlined />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      tooltip: 'Ordered List'
    },
    { type: 'divider' },
    {
      icon: <CodeOutlined />,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
      tooltip: 'Code Block'
    },
    { type: 'divider' },
    {
      icon: <UndoOutlined />,
      action: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
      tooltip: 'Undo'
    },
    {
      icon: <RedoOutlined />,
      action: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
      tooltip: 'Redo'
    },
  ];


  return (
    <Space wrap style={{ border: '1px solid #d9d9d9', padding: '8px', marginBottom: '8px', borderRadius: '4px' }}>
      {menuItems.map((item, index) => (
        item.type === 'divider' ? <span key={index} style={{ borderLeft: '1px solid #d9d9d9', height: '20px', margin: '0 8px' }} /> :
          <Tooltip key={index} title={item.tooltip}>
            <Button
              type={item.isActive ? 'primary' : 'text'}
              icon={item.icon}
              onClick={item.action}
              disabled={item.disabled}
              size="small"
            >
              {item.label}
            </Button>
          </Tooltip>
      ))}
    </Space>
  );
};

export default MenuBar;