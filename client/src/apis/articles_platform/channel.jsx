import {request} from '/src/utils';

// 获取频道
export function getChannelsAPI(params) {
  return request({
    url: '/channels',
    method: 'GET',
    params,
  });
}