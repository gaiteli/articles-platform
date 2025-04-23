import { request } from "/src/utils";

// 搜索文章
export function searchArticlesAPI(params) {
  return request({
    url: "/search",
    method: 'GET',
    params
  });
}

// 同步文章索引（仅管理员）
export function syncArticlesAPI() {
  return request({
    url: '/search/sync',
    method: 'POST'
  });
}