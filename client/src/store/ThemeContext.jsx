import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  customTheme: null,
  setCustomTheme: () => {},
  isCustomActive: false,
  toggleCustomTheme: () => {}
});

// 预设主题列表
export const THEMES = [
  { id: 'light', name: '浅色主题（默认）' },
  { id: 'dark', name: '深色模式' },
  { id: 'custom', name: '自定义主题' },
];

// 为了方便访问，创建主题ID常量
export const THEME_IDS = {
  LIGHT: 'light',
  DARK: 'dark',
  CUSTOM: 'custom'
};

// 默认自定义主题配置
const DEFAULT_CUSTOM_THEME = {
  firstColor: '230, 60%, 56%',
  primaryColor: '230, 60%, 66%',
  secondaryColor: '230, 70%, 16%',
  accentColor: '230, 16%, 45%',
  titleColor: '230, 70%, 16%',
  textColor: '230, 16%, 45%',
  backgroundColor: '230, 70%, 95%',
  cardBackgroundColor: '230, 60%, 98%',
  buttonBackgroundColor: '230, 60%, 56%',
  buttonTextColor: '230, 100%, 97%'
};

export const ThemeProvider = ({ children }) => {
  
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || THEME_IDS.LIGHT;
  });
  
  // 获取自定义主题设置
  const [customTheme, setCustomTheme] = useState(() => {
    const savedCustomTheme = localStorage.getItem('customTheme');
    return savedCustomTheme ? JSON.parse(savedCustomTheme) : DEFAULT_CUSTOM_THEME;
  });
  
  // 自定义主题是否激活
  const [isCustomActive, setIsCustomActive] = useState(() => {
    return theme === THEME_IDS.CUSTOM;
  });
  
  // 切换主题时更新document和localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    // 移除所有主题类
    root.classList.remove(THEME_IDS.LIGHT, THEME_IDS.DARK, THEME_IDS.CUSTOM);
    
    // 如果不是light主题，添加对应类名
    if (theme !== THEME_IDS.LIGHT) {
      root.classList.add(theme);
    }
    
    // 保存到localStorage
    localStorage.setItem('theme', theme);
    
    // 更新自定义主题激活状态
    setIsCustomActive(theme === THEME_IDS.CUSTOM);
    
    // 应用自定义主题变量（如果是自定义主题）
    if (theme === THEME_IDS.CUSTOM) {
      applyCustomThemeVariables(customTheme);
    }
  }, [theme, customTheme]);
  
  // 切换自定义主题
  const toggleCustomTheme = () => {
    if (theme === THEME_IDS.CUSTOM) {
      // 切换回上一个系统主题或默认主题
      const previousTheme = localStorage.getItem('previousTheme') || THEME_IDS.LIGHT;
      setTheme(previousTheme);
    } else {
      // 保存当前主题并切换到自定义主题
      localStorage.setItem('previousTheme', theme);
      setTheme(THEME_IDS.CUSTOM);
    }
  };
  
  // 应用自定义主题变量到CSS
  const applyCustomThemeVariables = (theme) => {
    const root = document.documentElement;
    
    // 设置所有自定义颜色变量
    root.style.setProperty('--user-first-color', `hsl(${theme.firstColor})`);
    root.style.setProperty('--user-primary-color', `hsl(${theme.primaryColor})`);
    root.style.setProperty('--user-secondary-color', `hsl(${theme.secondaryColor})`);
    root.style.setProperty('--user-accent-color', `hsl(${theme.accentColor})`);
    root.style.setProperty('--user-title-color', `hsl(${theme.titleColor})`);
    root.style.setProperty('--user-text-color', `hsl(${theme.textColor})`);
    root.style.setProperty('--user-background-color', `hsl(${theme.backgroundColor})`);
    root.style.setProperty('--user-card-background-color', `hsl(${theme.cardBackgroundColor})`);
    root.style.setProperty('--user-button-background-color', `hsl(${theme.buttonBackgroundColor})`);
    root.style.setProperty('--user-button-text-color', `hsl(${theme.buttonTextColor})`);
    
    // 保存自定义主题
    localStorage.setItem('customTheme', JSON.stringify(theme));
  };
  
  // 上下文值
  const contextValue = {
    theme,
    setTheme,
    customTheme,
    setCustomTheme: (newTheme) => {
      setCustomTheme(prev => {
        const updatedTheme = { ...prev, ...newTheme };
        applyCustomThemeVariables(updatedTheme);
        return updatedTheme;
      });
    },
    isCustomActive,
    toggleCustomTheme
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义Hook用于访问主题上下文
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};