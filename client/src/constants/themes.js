import {
  light,
  dark,
  lakeBlue,
  emeraldGreen,
  warmOrange,
  crimsonRed,
  lavender,
} from '/src/styles/themes'

// 定义基础的 CSS 变量名称
export const themeVariableKeys = [
  // 主色系
  'first-color',
  'primary-color',
  'primary-color-light',
  'primary-color-dark',
  'secondary-color',
  'accent-color',

  // 功能色
  'success-color',
  'warning-color',
  'error-color',
  'info-color',

  // 背景色系
  'background-color',
  'background-color-light',
  'background-color-dark',
  'hover-background-color',
  'active-background-color',
  'container-color',
  'header-background-color',
  'mask-background-color',
  'tooltip-background-color',
  'card-background-color',
  'sidebar-background-color',

  // 文字色系
  'title-color',
  'subtitle-color',
  'text-color',
  'text-color-secondary',
  'text-color-disabled',
  'muted-text-color',
  'heading-color',
  'link-color',
  'link-hover-color',
  'placeholder-color',

  // 边框色系
  'border-color',
  'border-color-light',
  'border-color-dark',
  'border-color-two',
  'divider-color',

  // 阴影
  'shadow-color',
  'box-shadow-base',
  'box-shadow-hover',

  // input
  'input-background',
  'input-border',   
  'input-text',     
  'input-placeholder',
  'input-focus-border',

  // button
  'button-background-color',
  'button-text-color',
  'button-background-color-hover',
  'button-text-color-hover',    
  'button-disabled-background',
  'button-disabled-text',

  // table
  'table-header-background',
  'table-row-odd', 
  'table-row-even', 
  'table-border', 
  'table-row-hover-background',

  // code
  'code-background',
  'code-text', 
  'code-border',

  // scrollbar
  'scrollbar-track',
  'scrollbar-thumb',
  'scrollbar-thumb-hover',
];

export const predefinedThemes = {
  light: {
    name: '明亮',
    id: 'light',
    colors: light.colors,
  },
  dark: {
    name: '暗黑',
    id: 'dark',
    colors: dark.colors,
  },
  'lake-blue': {
    name: '湖蓝',
    id: 'lake-blue',
    colors: lakeBlue.colors,
  },
  'emerald-green': {
    name: '翠绿',
    id: 'emerald-green',
    colors: emeraldGreen.colors,
  },
  'warm-orange': {
    name: '暖橙',
    id: 'warm-orange',
    colors: warmOrange.colors,
  },
  'crimson-red': {
    name: '殷红',
    id: 'crimson-red',
    colors: crimsonRed.colors,
  },
  'lavender': {
    name: '淡紫',
    id: 'lavender',
    colors: lavender.colors,
  },
};

// 用于存储用户自定义主题的 key
export const CUSTOM_THEME_STORAGE_KEY = 'customThemeColors';
export const ACTIVE_THEME_STORAGE_KEY = 'activeThemeId';
export const PREVIOUS_THEME_STORAGE_KEY = 'previousTheme';

// 自定义主题的默认值或结构
export const defaultCustomThemeColors = {
  '--primary-color': '#ff4d4f',
  '--background-color': '#ffffff',
  '--text-color': '#303133',
  // ... 其他变量的默认值
};