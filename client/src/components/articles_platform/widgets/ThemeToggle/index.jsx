// src/components/common/ThemeToggle/index.jsx
import React from 'react';
import { useTheme } from '/src/store/ThemeContext';
import styles from './index.module.scss';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

const ThemeToggle = ({classNameIcon}) => {
  const { theme, setTheme } = useTheme();
  
  const handleToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <button 
      className={styles.themeToggle} 
      onClick={handleToggle}
      aria-label={`切换到${theme === 'light' ? '深色' : '浅色'}模式`}
    >
      {theme === 'light' ? (
        <MoonOutlined className={classNameIcon} />
      ) : (
        <SunOutlined className={classNameIcon} />
      )}
    </button>
  );
};

export default ThemeToggle;