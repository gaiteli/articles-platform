import React, { useState, useEffect } from 'react';
import { useTheme, THEMES } from '../../../store/ThemeContext';
import styles from './ThemeSettings.module.scss';

// 颜色设置定义（调整为使用HSL格式）
const COLOR_SETTINGS = [
  { 
    label: '主色调', 
    key: 'primaryColor', 
    description: '按钮、链接和重点元素的颜色',
    defaultValue: '230, 60%, 66%'
  },
  { 
    label: '次要颜色', 
    key: 'secondaryColor', 
    description: '辅助和次要元素的颜色',
    defaultValue: '230, 70%, 16%'
  },
  { 
    label: '强调色', 
    key: 'accentColor', 
    description: '用于突出显示或装饰元素',
    defaultValue: '230, 16%, 45%'
  },
  { 
    label: '标题颜色', 
    key: 'titleColor', 
    description: '页面和卡片标题的颜色',
    defaultValue: '230, 70%, 16%'
  },
  { 
    label: '文本颜色', 
    key: 'textColor', 
    description: '正文和一般文本的颜色',
    defaultValue: '230, 16%, 45%'
  },
  { 
    label: '背景颜色', 
    key: 'backgroundColor', 
    description: '页面的主要背景色',
    defaultValue: '230, 70%, 95%'
  },
  { 
    label: '卡片背景色', 
    key: 'cardBackgroundColor', 
    description: '卡片和容器的背景色',
    defaultValue: '230, 60%, 98%'
  },
  { 
    label: '按钮背景色', 
    key: 'buttonBackgroundColor', 
    description: '主要按钮的背景色',
    defaultValue: '230, 60%, 56%'
  }
];

const ThemeSettings = () => {
  const { 
    theme, 
    setTheme, 
    customTheme, 
    setCustomTheme,
    isCustomActive,
    toggleCustomTheme
  } = useTheme();
  
  const [localCustomTheme, setLocalCustomTheme] = useState(customTheme);
  const [isDirty, setIsDirty] = useState(false);

  // 同步本地状态与上下文
  useEffect(() => {
    setLocalCustomTheme(customTheme);
    setIsDirty(false);
  }, [customTheme]);

  // 处理主题切换
  const handleThemeChange = (selectedTheme) => {
    if (selectedTheme === 'custom' && !isCustomActive) {
      toggleCustomTheme();
    } else if (selectedTheme !== 'custom' && isCustomActive) {
      toggleCustomTheme();
    }
    setTheme(selectedTheme);
  };

  // 处理颜色更改
  const handleColorChange = (key, value) => {
    setLocalCustomTheme(prev => ({
      ...prev,
      [key]: value
    }));
    setIsDirty(true);
  };

  // 保存自定义主题
  const handleSave = () => {
    setCustomTheme(localCustomTheme);
  };

  // 重置更改
  const handleReset = () => {
    setLocalCustomTheme(customTheme);
    setIsDirty(false);
  };

  // 应用预设模板
  const applyPreset = (preset) => {
    const newTheme = { ...localCustomTheme };
    Object.keys(preset).forEach(key => {
      if (COLOR_SETTINGS.some(setting => setting.key === key)) {
        newTheme[key] = preset[key];
      }
    });
    setLocalCustomTheme(newTheme);
    setIsDirty(true);
  };

  // 预设主题模板（HSL格式）
  const PRESETS = {
    ocean: {
      primaryColor: '210, 70%, 56%',
      secondaryColor: '210, 70%, 16%',
      accentColor: '210, 16%, 45%',
      titleColor: '210, 70%, 16%',
      textColor: '210, 16%, 45%',
      backgroundColor: '210, 70%, 95%',
      cardBackgroundColor: '210, 60%, 98%',
      buttonBackgroundColor: '210, 70%, 56%'
    },
    forest: {
      primaryColor: '145, 60%, 45%',
      secondaryColor: '145, 70%, 16%',
      accentColor: '145, 16%, 45%',
      titleColor: '145, 70%, 16%',
      textColor: '145, 16%, 45%',
      backgroundColor: '145, 70%, 95%',
      cardBackgroundColor: '145, 60%, 98%',
      buttonBackgroundColor: '145, 60%, 45%'
    }
  };

  // HSL转HEX（用于颜色选择器）
  const hslToHex = (hsl) => {
    const [h, s, l] = hsl.split(',').map(v => parseFloat(v.replace('%', '').trim()));
    const a = s * Math.min(l, 100 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // HEX转HSL
  const hexToHsl = (hex) => {
    // 实现转换逻辑...
    return '230, 60%, 56%'; // 示例返回值
  };

  return (
    <div className={styles.themeSettings}>
      <h2>主题设置</h2>
      
      <div className={styles.themeSelector}>
        <label>选择主题模式：</label>
        <div className={styles.themeOptions}>
          {THEMES.map(({ id, name }) => (
            <label key={id} className={styles.themeOption}>
              <input
                type="radio"
                name="theme"
                value={id}
                checked={(id === 'custom' && isCustomActive) || (id === theme && !isCustomActive)}
                onChange={() => handleThemeChange(id)}
              />
              <span>{name}</span>
            </label>
          ))}
        </div>
      </div>

      {isCustomActive && (
        <>
          <div className={styles.presetSection}>
            <h3>快速预设</h3>
            <div className={styles.presetGrid}>
              {Object.entries(PRESETS).map(([name, preset]) => (
                <button
                  key={name}
                  className={styles.presetButton}
                  onClick={() => applyPreset(preset)}
                  style={{
                    '--preset-primary-color': preset.primaryColor,
                    '--preset-bg-color': preset.backgroundColor
                  }}
                >
                  <span>{name === 'ocean' ? '海洋蓝' : '森林绿'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.colorSettings}>
            <h3>自定义颜色</h3>
            {COLOR_SETTINGS.map(({ key, label, description }) => (
              <div key={key} className={styles.colorSetting}>
                <div className={styles.colorLabel}>
                  <label>{label}</label>
                  <span className={styles.description}>{description}</span>
                </div>
                <div className={styles.colorInputs}>
                  <input
                    type="color"
                    value={hslToHex(localCustomTheme[key] || '230, 60%, 56%')}
                    onChange={(e) => handleColorChange(key, hexToHsl(e.target.value))}
                  />
                  <input
                    type="text"
                    value={localCustomTheme[key] || ''}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    placeholder="HSL格式，如: 230, 60%, 56%"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.previewSection}>
            <h3>实时预览</h3>
            <div 
              className={styles.previewContainer}
              style={{
                backgroundColor: `hsl(${localCustomTheme.backgroundColor})`,
                color: `hsl(${localCustomTheme.textColor})`
              }}
            >
              <div 
                className={styles.previewCard}
                style={{
                  backgroundColor: `hsl(${localCustomTheme.cardBackgroundColor})`,
                  borderColor: `hsl(${localCustomTheme.accentColor})`
                }}
              >
                <h4 style={{ color: `hsl(${localCustomTheme.titleColor})` }}>卡片标题</h4>
                <p>这是一段示例文本内容</p>
                <div className={styles.previewActions}>
                  <button 
                    style={{
                      backgroundColor: `hsl(${localCustomTheme.primaryColor})`,
                      color: 'white'
                    }}
                  >
                    主要按钮
                  </button>
                  <button 
                    style={{
                      backgroundColor: `hsl(${localCustomTheme.secondaryColor})`,
                      color: 'white'
                    }}
                  >
                    次要按钮
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isDirty && (
            <div className={styles.actionButtons}>
              <button 
                className={styles.saveButton}
                onClick={handleSave}
              >
                保存设置
              </button>
              <button 
                className={styles.resetButton}
                onClick={handleReset}
              >
                重置更改
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ThemeSettings;