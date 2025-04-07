// src/components/common/JTTEditor/ui/MenuBar/index.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { generateMenuItems } from '../../utils/generateMenuItems';
import styles from './index.module.scss';
import { useEditorContext } from '../../core/EditorContext';

const MenuBar = ({ preset = 'default' }) => {
  const editor = useEditorContext();

  if (!editor) {
    // Render placeholder or disabled state while editor loads
    return <div className={styles.menuBar} aria-disabled="true"></div>;
  }

  const menuItems = generateMenuItems(preset);

  // Clean separators (existing logic is fine)
  const cleanedMenuItems = menuItems.filter((item, index, array) => {
    if (item.type === 'separator') {
      if (index === 0 || index === array.length - 1) return false;
      if (array[index - 1]?.type === 'separator') return false; // Check previous exists
    }
    return true;
  });

  return (
    <div className={styles.menuBar}>
      {cleanedMenuItems.map((item, index) => {
        if (item.type === 'separator') {
          return <span key={`separator-${index}`} className={styles.separator}>|</span>;
        }

        // Check if action requires editor focus; chain it if needed.
        const action = () => item.action(editor); // Assuming item.action handles focus chaining if needed

        return (
          <button
            title={item.title}
            type="button"
            onClick={action}
            className={`${styles.menuItem} ${item.isActive && item.isActive(editor) ? styles.isActive : ''}`}
            // Disable button if editor cannot perform action OR if item.disabled check fails
            disabled={!editor.isEditable || (item.disabled && item.disabled(editor))}
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
};

MenuBar.propTypes = {
  // editor: PropTypes.object, // REMOVED - Get from context
  preset: PropTypes.string,
};

export default MenuBar;