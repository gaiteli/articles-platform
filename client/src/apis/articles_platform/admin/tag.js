import {request} from '/src/utils';

// admin接口
// 获取所有标签（管理员）
export function getTagsAdminAPI(params) {
  return request({
    url: '/admin/tags',
    method: 'GET',
    params,
  });
}

// 获取单个标签（管理员）
export function getTagByIdAdminAPI(id) {
  return request({
    url: `/admin/tags/${id}`,
    method: 'GET',
  });
}

// 创建标签（管理员）
export function addTagAdminAPI(data) {
  return request({
    url: '/admin/tags',
    method: 'POST',
    data,
  });
}

// 更新标签（管理员）
export function updateTagAdminAPI(id, data) {
  return request({
    url: `/admin/tags/${id}`,
    method: 'PUT',
    data,
  });
}

// 删除标签（管理员）
export function deleteTagAdminAPI(id) {
  return request({
    url: `/admin/tags/${id}`,
    method: 'DELETE',
  });
}

// 审核标签（管理员）- 注意这里的状态值必须是 'approved' 或 'rejected'
export function reviewTagAdminAPI(id, data) {
  return request({
    url: `/admin/tags/${id}/review`,
    method: 'PUT',
    data,
  });
}