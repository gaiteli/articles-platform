import { request } from "/src/utils";

// 增
export function createArticleAPI (data) {
  return request({
    url: '/articles-platform/write',
    method: 'POST',
    data
  })
}

// 查-获取单个文章
export function getArticleByIdAPI (id) {
  return request({
    url: `/articles-platform/p/${id}`
  })
}

// 查-获取文章列表
export function getArticleListAPI (params) {
  return request({
    url: "/articles-platform/list",
    method: 'GET',
    params
  })
}

// 改-更新文章
export function updateArticleAPI (data) {
  return request({
    url: `/articles-platform/edit/${data.id}`,
    method: 'PUT',
    data
  })
}

// 删-删除文章
export function delArticleAPI (id) {
  return request({
    url: `/articles-platform/delete/${id}`,
    method: 'DELETE'
  })
}

