// 定义基础的 CSS 变量名称
export const themeVariableKeys = [
  'primary-color',
  'secondary-color', // 可选，根据需要添加
  'background-color',
  'text-color',
  'border-color',
  'card-background-color',
  'sidebar-background-color',
  // ... 添加你项目中所有需要主题化的 CSS 变量名
];

export const predefinedThemes = {
  light: {
    name: '明亮', // 显示名称
    id: 'light',   // 唯一 ID
    colors: {
      '--primary-color': '#409EFF', // 示例
      '--secondary-color': '#67C23A',
      '--background-color': '#ffffff',
      '--text-color': '#303133',
      '--border-color': '#e4e7ed',
      '--card-background-color': '#ffffff',
      '--sidebar-background-color': '#f4f4f5',
      // ... 其他变量
    },
  },
  dark: {
    name: '暗黑',
    id: 'dark',
    colors: {
      '--primary-color': '#409EFF', // 暗黑下的主色可能不同，也可能相同
      '--secondary-color': '#67C23A',
      '--background-color': '#141414', // '#1f1f1f' or similar
      '--text-color': 'rgba(255, 255, 255, 0.85)',
      '--border-color': '#424242',
      '--card-background-color': '#1d1d1d',
      '--sidebar-background-color': '#001529', // Ant Design dark sidebar color
      // ... 其他变量
    },
  },
  'lake-blue': {
    name: '湖蓝',
    id: 'lake-blue',
    colors: {
      '--primary-color': '#1890ff',
      '--secondary-color': '#52c41a',
      '--background-color': '#f0f2f5',
      '--text-color': '#303133',
      '--border-color': '#d9d9d9',
      '--card-background-color': '#ffffff',
      '--sidebar-background-color': '#e6f7ff',
      // ... 其他变量
    },
  },
  'emerald-green': {
    name: '翠绿',
    id: 'emerald-green',
    colors: {
       '--primary-color': '#00a854',
       '--secondary-color': '#ff6b6b',
       '--background-color': '#f5fef5',
       '--text-color': '#333',
       '--border-color': '#b7eb8f',
       '--card-background-color': '#ffffff',
       '--sidebar-background-color': '#e4f7e4',
       // ...
    },
  },
   // --- 添加更多预定义主题 ---
   purple: { /* ... */ },
   'warm-orange': { /* ... */ },
   'crimson-red': { /* ... */ },
};

// 用于存储用户自定义主题的 key
export const CUSTOM_THEME_STORAGE_KEY = 'customThemeColors';
export const ACTIVE_THEME_STORAGE_KEY = 'activeThemeId';

// 自定义主题的默认值或结构
export const defaultCustomThemeColors = {
  '--primary-color': '#ff4d4f',
  '--background-color': '#ffffff',
  '--text-color': '#303133',
   // ... 其他变量的默认值
};