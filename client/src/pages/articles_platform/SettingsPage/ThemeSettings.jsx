import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '/src/store/ThemeContext';
import { themeVariableKeys } from '/src/constants/themes';
import { Radio, Button, ColorPicker, Space, Divider, Card, Typography } from 'antd';
import styles from './ThemeSettings.module.scss';

const { Title, Text } = Typography;

const ThemeSettings = () => {
  const {
    theme,              // 当前活动主题 ID
    setTheme,           // 设置主题函数
    updateCustomTheme,  // 更新自定义主题函数
    customThemeColors,  // 当前自定义颜色
    availableThemes,    // 所有预定义主题
    isThemeInitialized  // 主题是否初始化完成
  } = useContext(ThemeContext);

  const [localCustomColors, setLocalCustomColors] = useState({}); // 颜色选择器的本地状态

  // 更新本地状态
  useEffect(() => {
    if (isThemeInitialized) {
      setLocalCustomColors(customThemeColors || {});
    }
  }, [customThemeColors, isThemeInitialized]);


  // 处理预定义主题选择
  const handleThemeChange = (e) => {
    const selectedThemeId = e.target.value;
    setTheme(selectedThemeId);
  };

  // 处理颜色选择器变化
  const handleColorChange = (cssVarName, color) => {
    // 转换antdColorPicker返回的Color对象
    const hexColor = typeof color === 'object' ? color.toHexString() : color;
    setLocalCustomColors(prev => ({
      ...prev,
      [cssVarName]: hexColor,
    }));
  };

  // 保存自定义主题
  const handleSaveCustomTheme = () => {
    updateCustomTheme(localCustomColors); // 将本地编辑的颜色保存到Context & localStorage
    // 如果当前不是自定义主题，切换过去
    if (theme !== 'custom') {
      setTheme('custom');
    }
    message.success('自定义主题已保存并应用');
    console.log('Custom theme saved:', localCustomColors);
  };

  // 如果主题尚未初始化，显示加载状态或禁用控件
  if (!isThemeInitialized) {
    return <div>Loading theme settings...</div>;
  }

  return (
    <div className={styles.themeSettingsContainer}>
      <Title level={4}>选择主题</Title>
      <Radio.Group onChange={handleThemeChange} value={theme}>
        <Space direction="vertical">
          {Object.values(availableThemes).map(t => (
            <Radio key={t.id} value={t.id}>
              {t.name}
              {/* 显示主题预览色块 */}
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                backgroundColor: t.colors['--primary-color'],
                marginLeft: '8px',
                verticalAlign: 'middle',
                border: '2px solid var(--border-color)'
              }}></span>
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                backgroundColor: t.colors['--background-color'],
                marginLeft: '4px',
                verticalAlign: 'middle',
                border: '2px solid var(--border-color)'
              }}></span>
            </Radio>
          ))}
          <Radio key="custom" value="custom">
            自定义主题
          </Radio>
        </Space>
      </Radio.Group>

      <Divider />

      <Title level={4}>自定义主题颜色</Title>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          {themeVariableKeys.map(key => {
            const cssVarName = `--${key}`;
            // 从 localCustomColors 获取当前编辑值，若无则用 context 的值，再无则用空字符串
            const currentColor = localCustomColors[cssVarName] ?? customThemeColors[cssVarName] ?? '#000000';
            return (
              <div key={cssVarName} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Text style={{ minWidth: '150px', marginRight: '10px' }}>{key}:</Text>
                <ColorPicker
                  value={currentColor}
                  onChange={(color) => handleColorChange(cssVarName, color)} // 传递 color 对象或字符串
                  showText // 显示 Hex 值
                />
              </div>
            );
          })}
          <Button type="primary" onClick={handleSaveCustomTheme}>
            保存并应用自定义主题
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ThemeSettings;