import {request} from '/src/utils';

// 获取公共标签
export function getPublicTagsAPI(params) {
  return request({
    url: '/articles-platform/tags',
    method: 'GET',
    params: { ...params, type: 'public' },
  });
}

// 获取用户私人标签
export function getUserTagsAPI() {
  return request({
    url: '/articles-platform/tags/user',
    method: 'GET',
  });
}

// 创建新标签
export function createTagAPI(data) {
  return request({
    url: '/articles-platform/tags',
    method: 'POST',
    data,
  });
}

// 获取文章关联的标签
export function getArticleTagsAPI(articleId) {
  return request({
    url: `/articles-platform/tags/article/${articleId}`,
    method: 'GET',
  });
}

// 为文章设置标签
export function setArticleTagsAPI(articleId, data) {
  return request({
    url: `/articles-platform/tags/article/${articleId}`,
    method: 'POST',
    data,
  });
}

// 提交标签审核
export function submitTagReviewAPI(tagId) {
  return request({
    url: `/articles-platform/tags/${tagId}/review`,
    method: 'PUT',
  });
}
