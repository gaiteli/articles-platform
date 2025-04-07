import React, { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import {
  predefinedThemes,
  CUSTOM_THEME_STORAGE_KEY,
  ACTIVE_THEME_STORAGE_KEY,
  PREVIOUS_THEME_STORAGE_KEY,
  defaultCustomThemeColors,
  themeVariableKeys         // 导入变量 key 列表
} from '../constants/themes';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [activeThemeId, setActiveThemeId] = useState('light');
  const [customThemeColors, setCustomThemeColors] = useState(defaultCustomThemeColors);
  const [previousThemeId, setPreviousThemeId] = useState('light'); 
  const [isInitialized, setIsInitialized] = useState(false);

  // 应用主题（设置CSS变量）
  const applyTheme = useCallback((themeId, colors) => {
    const root = document.documentElement;
    if (!root) return;

    Object.entries(colors).forEach(([key, value]) => {
      if (key.startsWith('--')) {               // 确保是 CSS 变量
        root.style.setProperty(key, value);
      }
    });

    root.setAttribute('data-theme', themeId);   // 旧深色模式方法依赖于data-theme

    console.log(`Theme applied: ${themeId}`);
  }, []);


  // 加载并应用初始主题
  useEffect(() => {
    const savedThemeId = localStorage.getItem(ACTIVE_THEME_STORAGE_KEY) || 'light';
    const savedPreviousThemeId = localStorage.getItem(PREVIOUS_THEME_STORAGE_KEY) || 'light';

    let themeToApply;
    let colorsToApply;

    if (savedThemeId === 'custom') {
      const savedCustomColorsString = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
      try {
        const savedCustomColors = savedCustomColorsString
          ? JSON.parse(savedCustomColorsString)
          : defaultCustomThemeColors;
        // 确保加载的自定义颜色包含所有必要的 key
        const mergedCustomColors = { ...defaultCustomThemeColors, ...savedCustomColors };
        setCustomThemeColors(mergedCustomColors);
        setActiveThemeId('custom');
        colorsToApply = mergedCustomColors;
        themeToApply = 'custom';
      } catch (error) {
        console.error("Failed to parse custom theme colors, falling back to default.", error);
        // 解析失败，回退到默认Light主题
        localStorage.removeItem(CUSTOM_THEME_STORAGE_KEY);
        localStorage.setItem(ACTIVE_THEME_STORAGE_KEY, 'light');
        setActiveThemeId('light');
        colorsToApply = predefinedThemes.light.colors;
        themeToApply = 'light';
      }
    } else if (predefinedThemes[savedThemeId]) {
      setActiveThemeId(savedThemeId);
      colorsToApply = predefinedThemes[savedThemeId].colors;
      themeToApply = savedThemeId;
    } else {
      // 如果保存的主题ID无效，回退到Light
      console.warn(`Saved theme ID "${savedThemeId}" not found, falling back to light.`);
      localStorage.setItem(ACTIVE_THEME_STORAGE_KEY, 'light');
      setActiveThemeId('light');
      colorsToApply = predefinedThemes.light.colors;
      themeToApply = 'light';
    }

    setPreviousThemeId(savedPreviousThemeId);

    if (colorsToApply && themeToApply) {
      applyTheme(themeToApply, colorsToApply);
    }
    setIsInitialized(true);     // 标记初始化完成
  }, [applyTheme]); // 初始加载


  // 切换或设置新主题
  const setTheme = useCallback((themeId) => {
    if (!isInitialized) return; // 防止在初始化完成前意外调用

    let colorsToApply;
    let idToSave;

    if (themeId === 'custom') {
      // 切换到自定义主题时，使用当前存储的自定义颜色
      colorsToApply = customThemeColors;
      idToSave = 'custom';
    } else if (predefinedThemes[themeId]) {
      colorsToApply = predefinedThemes[themeId].colors;
      idToSave = themeId;

      // 当切换到非深色主题时，更新previousThemeId
      if (themeId !== 'dark') {
        setPreviousThemeId(themeId);
        localStorage.setItem(PREVIOUS_THEME_STORAGE_KEY, themeId);
      }
    } else {
      console.error(`Attempted to set invalid theme: ${themeId}`);
      return; // 无效主题，不切换
    }

    applyTheme(idToSave, colorsToApply);
    setActiveThemeId(idToSave);
    localStorage.setItem(ACTIVE_THEME_STORAGE_KEY, idToSave);
  }, [applyTheme, customThemeColors, isInitialized]); // 依赖 customThemeColors


  // 更新并保存自定义主题颜色
  const updateCustomTheme = useCallback((newCustomColors) => {
    if (!isInitialized) return; // 防止在初始化完成前意外调用

    // 确保只包含合法的 key
    const validCustomColors = {};
    themeVariableKeys.forEach(key => {
      const cssVarKey = `--${key}`;
      if (newCustomColors[cssVarKey] !== undefined) {
        validCustomColors[cssVarKey] = newCustomColors[cssVarKey];
      } else {
        // 如果传入的新颜色缺少某个key，可以从默认或当前自定义主题中补充
        validCustomColors[cssVarKey] = customThemeColors[cssVarKey] || defaultCustomThemeColors[cssVarKey] || '#000000'; // 提供最终后备
      }
    });

    setCustomThemeColors(validCustomColors);
    localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(validCustomColors));

    // 如果当前主题就是自定义主题，则立即应用新颜色
    if (activeThemeId === 'custom') {
      applyTheme('custom', validCustomColors);
    }
    console.log("Custom theme updated and saved.");
  }, [activeThemeId, applyTheme, isInitialized, customThemeColors]); // 依赖 activeThemeId 和 applyTheme


  // 提供给子组件的值
  const value = useMemo(() => ({
    theme: activeThemeId,   // 当前激活的主题 ID ('light', 'dark', 'custom', ...)
    previousTheme: previousThemeId,
    setTheme,               // 函数：用于切换到预定义主题或 'custom'
    updateCustomTheme,      // 函数：用于更新自定义主题的颜色
    customThemeColors,      // 对象：当前存储的自定义颜色
    availableThemes: predefinedThemes, // 对象：所有预定义的主题配置
    isThemeInitialized: isInitialized, // 状态：主题是否已从 localStorage 加载完毕
  }), [activeThemeId, previousThemeId, setTheme, updateCustomTheme, customThemeColors, isInitialized]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};


const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};


export { ThemeProvider, ThemeContext, useTheme };