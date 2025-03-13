import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import hljs from 'highlight.js';
import Quill from 'quill';
import Markdown from 'quilljs-markdown';
import { message } from 'antd';

import { uploadAttachmentAPI } from '/src/apis/articles_platform/attachment';

import "quill/dist/quill.snow.css";
import 'highlight.js/styles/github.min.css';
import styles from './index.module.scss'

Quill.register('modules/markdown', Markdown);   // 注册Markdown作为Quill的扩展

const toolbarOptions = [  // 工具栏选项数组，由于改为自定义工具栏故已废弃
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
const EditorContent = forwardRef(({
  readOnly, defaultValue, onTextChange, onSelectionChange, toolbarContainerId
}, ref) => {
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
          container: document.getElementById(toolbarContainerId), // 指定外部工具栏容器
          handlers: {     // 自定义处理函数
            image: () => {
              // 创建文件输入框
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.click();

              // 监听文件选择
              input.onchange = async () => {
                const file = input.files[0];
                if (file) {
                  try {
                    // 检查
                    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
                    if (!isJpgOrPng) throw new Error('图片格式不正确，请提交jpeg/png格式')
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) throw new Error('图片大小不能超过 2MB！')

                    // 上传图片到OSS，获取图片URL
                    const formData = new FormData();
                    formData.append('image', file);
                    const res = await uploadAttachmentAPI(formData);
                    const imageUrl = res.data.url;

                    // 获取当前光标位置
                    const range = quill.getSelection(true);

                    // 插入图片到编辑器
                    quill.insertEmbed(range.index, 'image', imageUrl, Quill.sources.USER);
                    quill.setSelection(range.index + 1, Quill.sources.SILENT);
                  } catch (error) {
                    message.error('图片上传失败，请重试! 原因：'+error)
                  }
                }
              };
            },
          },
        },
        // syntax: {  // 1.x已过时语法
        //   highlight: text => hljs.highlightAuto(text).value
        // },
        syntax: {
          hljs: {
            highlight: (language, text) => {
              let res = hljs.highlightAuto(text);
              console.log('language:', language, 'res:', res);
              return res
            }
          }
        },
        markdown: {},   // 启用markdown模块
        table: true,    // 启用表格功能
      },
      placeholder: '请输入内容...',
      theme: 'snow',
    });

    ref.current = quill;    // 将Quill实例传递给父组件

    // quill.on('text-change', () => {
    //   document.querySelectorAll('pre code').forEach((block) => {
    //     hljs.highlightBlock(block);
    //   });
    // });
    // // document.querySelector('.ql-ui').addEventListener('change', (event) => {
    // //   const language = event.target.value;
    // //   hljs.configure({ languages: [language] }); // 更新配置
    // //   document.querySelectorAll('pre code').forEach((block) => {
    // //     hljs.highlightBlock(block); // 重新渲染代码块
    // //   });
    // // });

    // quill.on('text-change', () => {
    //   document.querySelectorAll('pre').forEach((pre) => {
    //     if (!pre.querySelector('code')) {
    //       pre.innerHTML = `<code>${pre.innerHTML}</code>`;
    //     }
    //     hljs.highlightBlock(pre.querySelector('code'));
    //   });
    // });

    // 输入光标距离视口下缘一段距离即开始滚动
    // 盒子长高多少，窗口就往下滑动多少
    // const scrollThreshold = 50; // 距离视口下边缘的阈值（像素）
    // const handleScroll = () => {
    //   const { scrollTop, clientHeight, scrollHeight } = editorContainer;
    //   const cursorPosition = quill.getSelection()?.index || 0;
    //   const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

    //   if (cursorPosition > distanceToBottom - scrollThreshold) {
    //     editorContainer.scrollTop += 20; // 滚动 20 像素
    //   }
    // };
    // editorContainer.addEventListener('scroll', handleScroll);


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