import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import styles from './index.module.scss'

const EditorToolbar = () => {
  return (
    <div id="custom-toolbar-container" className={styles.customEditorToolbar}>
      {/* 字体和大小 */}
      <span className="ql-formats">
        <select className="ql-font" defaultValue="serif">
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
        <select
          className="ql-size"
          defaultValue=""
          id={styles.selectDisabled}
          disabled    // 目前存在bug，暂时禁用
          title="暂不可用"
        >
          <option value="small">小</option>
          <option value="">中</option>
          <option value="large">大</option>
          <option value="huge">巨</option>
        </select>
      </span>
      {/* 字体样式 */}
      <span className="ql-formats">
        <button className="ql-header" value="1"></button>
        <button className="ql-header" value="2"></button>
      </span>
      <span className="ql-formats">
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-strike"></button>
      </span>
      <span className="ql-formats">
        <button className="ql-script" value="sub"></button>
        <button className="ql-script" value="super"></button>
      </span>
      <span className="ql-formats">
        <select className="ql-color"></select>
        <select className="ql-background"></select>
      </span>
      {/* 引用块和代码块 */}
      <span className="ql-formats">
        <button className="ql-blockquote"></button>
        <button className="ql-code-block"></button>
      </span>
      {/* 列表 */}
      <span className="ql-formats">
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
        <button className="ql-list" value="check"></button>
      </span>
      {/* 多媒体 */}
      <span className="ql-formats">
        <button className="ql-link"></button>
        <button className="ql-image"></button>
        <button className="ql-video"></button>
        <button className="ql-formula"></button>
      </span>
      {/* 杂项 */}
      <span className="ql-formats">
        <button className="ql-indent" value="-1"></button>
        <button className="ql-indent" value="+1"></button>
      </span>
      <span className="ql-formats">
        <select className="ql-align"></select>
      </span>
      <span className="ql-formats">
        <button className="ql-clean"></button>
      </span>
      {/* 表格 */}
      <span className="ql-formats">
        <button className="ql-table" value="TD"></button>
        <button className="ql-table-insert-row" value="TIR"></button>
        <button className="ql-table-insert-column" value="TIC"></button>
        <button className="ql-table-delete-row" value="TDR"></button>
        <button className="ql-table-delete-column" value="TDC"></button>
      </span>
    </div>
  );
};

export default EditorToolbar;