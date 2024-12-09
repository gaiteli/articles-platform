import React, {useEffect, useRef} from 'react';
import * as echarts from 'echarts';
import LineChart from './components/LineChart.jsx';


const Home = () => {
  
  return (
    <div>
      <LineChart title={'Pic 1'}/>
      <LineChart title={'Pic 2'}/>
    </div>
  )
}

export default Home