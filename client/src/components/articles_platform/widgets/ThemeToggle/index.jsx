import React from 'react';
import { useTheme } from '/src/store/ThemeContext';
import styles from './index.module.scss';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

const ThemeToggle = ({classNameIcon}) => {
  const { theme, previousTheme, setTheme } = useTheme();
  
  const handleToggle = () => {
    if (theme === 'dark') {   // 从深色模式切换回上一个非深色主题
      setTheme(previousTheme === 'dark' ? 'light' : previousTheme);  // 以防previous也是dark无法更改
    } else {              // 切换到深色模式
      setTheme('dark');
    }
  };
  
  return (
    <button 
      className={styles.themeToggle} 
      onClick={handleToggle}
      aria-label={`切换到${theme === 'dark' ? '浅色' : '深色'}模式`}
    >
      {theme === 'dark' ? (
        <SunOutlined className={classNameIcon} />
      ) : (
        <MoonOutlined className={classNameIcon} />
      )}
    </button>
  );
};

export default ThemeToggle;