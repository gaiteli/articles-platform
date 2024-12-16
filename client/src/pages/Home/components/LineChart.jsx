import React, {useEffect, useRef} from 'react';
import * as echarts from 'echarts';

const LineChart = ({ title }) => {
  const chartRef = useRef(null)
  useEffect(() => {
    // 1. 获取dom节点以供渲染
    const chartDom = chartRef.current
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
    }
    // 4. 完成渲染
    option && myChart.setOption(option);
  }, [])
  return (
    <div ref={chartRef} style={{width:'300px', height:'300px'}}></div>
  )
}

export default LineChart