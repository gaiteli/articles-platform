import { request } from '/src/utils';

// 获取反馈列表（管理员）
export function getFeedbacksAdminAPI(params) {
  return request({
    url: '/admin/feedbacks',
    method: 'GET',
    params
  });
}

// 更新反馈状态
export function updateFeedbackStatusAPI(id, data) {
  return request({
    url: `/admin/feedbacks/${id}`,
    method: 'PUT',
    data
  });
}

// 删除反馈
export function deleteFeedbackAPI(id) {
  return request({
    url: `/admin/feedbacks/${id}`,
    method: 'DELETE'
  });
}