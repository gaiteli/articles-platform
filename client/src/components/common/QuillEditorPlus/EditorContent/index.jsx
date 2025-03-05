import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import Markdown from 'quilljs-markdown';

import Toolbar from "quill/modules/toolbar";
import Snow from "quill/themes/snow";

import Bold from "quill/formats/bold";
import Italic from "quill/formats/italic";
import Header from "quill/formats/header";

import "quill/dist/quill.snow.css";
import styles from './index.module.scss'

// Quill.register({
//   "modules/toolbar": Toolbar,
//   "themes/snow": Snow,
//   "formats/bold": Bold,
//   "formats/italic": Italic,
//   "formats/header": Header,
// });
Quill.register('modules/markdown', Markdown);   // 注册Markdown作为Quill的扩展

const toolbarOptions = [
  [{ 'font': ['serif', 'monospace', 'arial'] }, { 'size': ['small', false, 'large', 'huge'] }],  // 字体大小
  ['bold', 'italic', 'underline', 'strike'],        // 加粗、斜体、下划线、删除线
  ['blockquote', 'code-block'],                    // 引用、代码块
  [{ 'header': 1 }, { 'header': 2 }],               // 标题
  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],      // 列表
  [{ 'script': 'sub' }, { 'script': 'super' }],      // 上标/下标
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'align': [] }],                               // 对齐方式
  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  ['link', 'image', 'video', 'formula'],                     // 链接、图片、视频
  [
    { 'table': 'TD' },
    { 'table-insert-row': 'TIR' },
    { 'table-insert-column': 'TIC' },
    { 'table-delete-row': 'TDR' },
    { 'table-delete-column': 'TDC' }
  ],
  ['clean']                                         // remove formatting button
]


// EditorContent is an uncontrolled React component
const EditorContent = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange, toolbarContainerId }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    // 更新回调函数的引用
    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    // 处理只读模式
    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    // 初始化Quill编辑器
    useEffect(() => {
      const container = containerRef.current;

      // 创建编辑器容器
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );

      // 初始化Quill
      const quill = new Quill(editorContainer, {
        modules: {
          toolbar: {
            container: document.getElementById(toolbarContainerId) // 指定外部工具栏容器
          },
          markdown: {},   // 启用markdown模块
          table: true,    // 启用表格功能
        },
        placeholder: '请输入内容...',
        theme: 'snow',
      });

      ref.current = quill;    // 将Quill实例传递给父组件


      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        ref.current = null;
        container.innerHTML = '';
      };
    }, [ref]);

    return (
      <div ref={containerRef} className={styles.quillContent} ></div>
    );
  },
);

EditorContent.displayName = 'EditorContent';

export default EditorContent;