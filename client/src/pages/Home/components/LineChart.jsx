import React, { useEffect, useRef } from 'react';
// 按需引入核心模块和需要的组件
import * as echarts from 'echarts/core';
import { LineChart as EChartsLine } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必需的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  EChartsLine,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

const LineChart = ({ title }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    // 1. 获取dom节点以供渲染
    const chartDom = chartRef.current;
    // 2. 图标初始化生成实例对象
    const myChart = echarts.init(chartDom);
    // 3. 准备参数
    const option = {
      title: {
        text: title
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    };
    // 4. 完成渲染
    option && myChart.setOption(option);
    
    // 添加resize监听以确保图表响应窗口变化
    const handleResize = () => {
      myChart.resize();
    };
    window.addEventListener('resize', handleResize);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }, [title]); // 添加title作为依赖项
  
  return (
    <div ref={chartRef} style={{width:'300px', height:'300px'}}></div>
  );
};

export default LineChart;