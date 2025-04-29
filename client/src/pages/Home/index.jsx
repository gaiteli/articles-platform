import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag } from 'antd';
import { 
  UserOutlined, 
  ReadOutlined, 
  LikeOutlined, 
  CommentOutlined,
  DotChartOutlined
} from '@ant-design/icons';

import styles from './index.module.scss';
import { getStatisticsAPI } from '/src/apis/articles_platform/dashboard';


const Home = () => {
  const [statistics, setStatistics] = useState([0,0,0])

  const statisticsDashboard = [
    { 
      title: '用户总数', 
      value: statistics[0], 
      icon: <UserOutlined />, 
      color: '#1890ff' 
    },
    { 
      title: '文章总数', 
      value: statistics[1], 
      icon: <ReadOutlined />, 
      color: '#52c41a' 
    },
    { 
      title: '点赞总数', 
      value: statistics[2], 
      icon: <LikeOutlined />, 
      color: '#722ed1' 
    },
    { 
      title: '(敬请期待)', 
      value: '-', 
      icon: <DotChartOutlined />, 
      color: '#fa8c16' 
    }
  ]


  useEffect(() => {
    try {
      const fetchDashboard = async () => {
        const { data: stat } = await getStatisticsAPI()
        // const trend = await getTrendsAPI()
        setStatistics([stat.userCount, stat.articleCount, stat.totalLikes])
      }
      fetchDashboard()
    } catch (error) {
      console.log('get statistics failed: '+error);
    }
  }, [])


  return (
    <div className={styles.dashboard}>
      {/* 统计数据 */}
      <Row gutter={[16, 16]}>
        {statisticsDashboard.map(stat => (
          <Col xs={24} sm={12} md={6} key={stat.title}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={React.cloneElement(stat.icon, { style: { color: stat.color } })}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={12}>
          <Card title="用户增长趋势">
            待开发
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="文章发布趋势">
            待开发
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;