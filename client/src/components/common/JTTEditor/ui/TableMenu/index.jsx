import React, { useState, useEffect, useRef } from 'react';
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  MergeCellsOutlined,
  SplitCellsOutlined,
} from '@ant-design/icons';
import styles from './index.module.scss';

const TableMenu = ({ editor }) => {
  const menuRef = useRef(null)
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // 检查当前选择是否在表格内部
  const isCursorInTable = () => {
    if (!editor) return false;

    const { state } = editor;
    const { selection } = state;
    let isInTable = false;

    // 获取当前光标位置的节点
    state.doc.nodesBetween(selection.from, selection.to, (node) => {
      if (node.type.name === 'table' ||
        node.type.name === 'tableRow' ||
        node.type.name === 'tableCell' ||
        node.type.name === 'tableHeader') {
        isInTable = true;
        return false; // 停止遍历
      }
    });

    return isInTable;
  };

  // 从选择中找到表格DOM元素
  const findTableDomFromSelection = (view, selection) => {
    // 从光标位置向上查找最近的表格元素
    let node = view.domAtPos(selection.from)?.node;
    while (node && node !== view.dom) {
      if (node.nodeName === 'TABLE') {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };


  useEffect(() => {
    // 监听表格选择事件
    const updateFloatingMenu = () => {
      if (!editor) return;

      if (isCursorInTable()) {
        // 表格被选中，显示悬浮菜单
        const { view } = editor;
        const { state } = view;
        const { selection } = state;
        const tableDom = findTableDomFromSelection(view, selection);

        if (tableDom) {
          const tableRect = tableDom.getBoundingClientRect();
          const editorRect = view.dom.getBoundingClientRect();

          // 设置悬浮菜单位置（在表格上方）
          setPosition({
            top: tableRect.top - editorRect.top - 10, // 减去菜单高度和一些间距
            left: tableRect.left - editorRect.left,
          });

          setVisible(true);
        }
      } else {
        // 表格未选中，隐藏悬浮菜单
        setVisible(false);
      }
    };


    // 监听编辑器状态变化
    if (editor) {
      editor.on('selectionUpdate', updateFloatingMenu);
      editor.on('focus', updateFloatingMenu);
      editor.on('transaction', updateFloatingMenu);
    }

    return () => {
      if (editor) {
        editor.off('selectionUpdate', updateFloatingMenu);
        editor.off('focus', updateFloatingMenu);
        editor.off('transaction', updateFloatingMenu);
      }
    };
  }, [editor]);

  if (!editor || !visible) {
    return null;
  }

  const tableActions = [
    {
      title: '左新增列',
      icon: (<><PlusCircleOutlined />|</>),
      action: () => editor.chain().focus().addColumnBefore().run(),
      disabled: () => !editor.can().addColumnBefore(),
    },
    {
      title: '右新增列',
      icon: (<>|<PlusCircleOutlined /></>),
      action: () => editor.chain().focus().addColumnAfter().run(),
      disabled: () => !editor.can().addColumnAfter(),
    },
    {
      title: '删除列',
      icon: (<>|<MinusCircleOutlined />|</>),
      action: () => editor.chain().focus().deleteColumn().run(),
      disabled: () => !editor.can().deleteColumn(),
    },
    {
      type: 'separator',
    },
    {
      title: '上新增行',
      icon: (<><PlusCircleOutlined />-</>),
      action: () => editor.chain().focus().addRowBefore().run(),
      disabled: () => !editor.can().addRowBefore(),
    },
    {
      title: '下新增行',
      icon: (<>-<PlusCircleOutlined /></>),
      action: () => editor.chain().focus().addRowAfter().run(),
      disabled: () => !editor.can().addRowAfter(),
    },
    {
      title: '删除行',
      icon: (<>-<MinusCircleOutlined />-</>),
      action: () => editor.chain().focus().deleteRow().run(),
      disabled: () => !editor.can().deleteRow(),
    },
    {
      type: 'separator',
    },
    {
      title: '删除表格',
      icon: <DeleteOutlined />,
      action: () => editor.chain().focus().deleteTable().run(),
      disabled: () => !editor.can().deleteTable(),
    },
    {
      title: '合并单元格',
      icon: <MergeCellsOutlined />,
      action: () => editor.chain().focus().mergeCells().run(),
      disabled: () => !editor.can().mergeCells(),
    },
    {
      title: '分裂单元格',
      icon: <SplitCellsOutlined />,
      action: () => editor.chain().focus().splitCell().run(),
      disabled: () => !editor.can().splitCell(),
    },
    {
      title: '列切换表头',
      icon: '列切换表头',
      action: () => editor.chain().focus().toggleHeaderColumn().run(),
      disabled: () => !editor.can().toggleHeaderColumn(),
    },
    {
      title: '行切换表头',
      icon: '行切换表头',
      action: () => editor.chain().focus().toggleHeaderRow().run(),
      disabled: () => !editor.can().toggleHeaderRow(),
    },
    {
      title: '单元切换表头',
      icon: '单元切换表头',
      action: () => editor.chain().focus().toggleHeaderCell().run(),
      disabled: () => !editor.can().toggleHeaderCell(),
    },
    // {
    //   title: 'Fix tables',
    //   icon: <BorderOutlined />,
    //   action: () => editor.chain().focus().fixTables().run(),
    //   disabled: () => !editor.can().fixTables(),
    // }
  ];

  return (
    <div
      ref={menuRef}
      className={styles.floatingTableMenu}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      {tableActions.map((action, index) => {
        if (action.type === 'separator') {
          return <span key={`separator-${index}`} className={styles.separator} />
        }

        return (
          <button
            key={`table-action-${index}`}
            title={action.title}
            type="button"
            onClick={action.action}
            className={styles.tableMenuItem}
            disabled={action.disabled()}
          >
            {action.icon}
            <span className={styles.tooltipText}>{action.title}</span>
          </button>
        )
      })}
    </div>
  );
};

export default TableMenu;