import { request } from '/src/utils';

// 提交反馈
export const submitFeedbackAPI = (data) => {
  return request({
    url: '/articles-platform/feedbacks',
    method: 'POST',
    data
  });
};

// 获取用户反馈列表
export const getFeedbacksAPI = () => {
  return request({
    url: '/articles-platform/feedbacks',
    method: 'GET'
  });
};