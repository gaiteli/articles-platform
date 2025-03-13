import {request} from '/src/utils';

// 获取频道
export function getChannelsAPI(params) {
  return request({
    url: '/channels',
    method: 'GET',
    params,
  });
}


// admin接口
// GET all
export function getChannelsAdminAPI(params) {
  console.log(params);
  return request({
    url: '/admin/channels',
    method: 'GET',
    params,
  });
}

// GET by ID


// POST
export function addChannelAdminAPI() {
  return request({
    url: '/admin/channels',
    method: 'POST',
  });
}


// PUT
export function updateChannelAdminAPI (id,data) {
  return request({
    url: `/admin/channels/${id}`,
    method: 'PUT',
    data
  })
}


// DELETE
export function deleteChannelAdminAPI(id) {
  return request({
    url: `/admin/channels/${id}`,
    method: 'DELETE',
  });
}