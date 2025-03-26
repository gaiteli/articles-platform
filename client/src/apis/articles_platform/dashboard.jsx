import {request} from '/src/utils';

// 获取统计数据
export function getStatisticsAPI() {
  return request({
    url: '/admin/dashboard/statistics',
    method: 'get'
  });
}

// 获取趋势数据
export function getTrendsAPI() {
  return request({
    url: '/admin/dashboard/trends',
    method: 'get'
  });
}