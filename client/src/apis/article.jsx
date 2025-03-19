import { request } from "/src/utils";


// 2. 提交文章表单
export function createArticleAPI (data) {
  return request({
    url: '/admin/articles',
    method: 'POST',
    data
  })
}

// 获取文章列表
export function getArticleListAPI (params) {
  return request({
    url: "/admin/articles",
    method: 'GET',
    params
  })
}

// 删除文章
export function delArticleAPI (id) {
  return request({
    url: `/admin/articles/${id}`,
    method: 'DELETE'
  })
}
