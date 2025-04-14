import { request } from "/src/utils";

// 增
export function createArticleAPI(data) {
  return request({
    url: '/articles-platform/write',
    method: 'POST',
    data
  })
}

// 查-获取单个文章
export function getArticleByIdAPI(id) {
  return request({
    url: `/articles-platform/p/${id}`
  })
}

// 查-编辑时获取单个文章
export function getArticleByIdWhenEditAPI(id) {
  return request({
    url: `/articles-platform/edit/${id}`
  })
}

// 查-获取文章列表
export function getArticleListAPI(params) {
  return request({
    url: "/articles-platform/list",
    method: 'GET',
    params
  })
}

// 查-获取最近文章列表
export function getRecentArticlesAPI(params) {
  return request({
    url: "/articles-platform/list",
    method: 'GET',
    params: {
      ...params,            // 其他参数（如 limit、category 等）
      sortBy: 'createdAt',  // 按发布时间排序
      sortOrder: 'DESC',
    }
  })
}

// 查-获取最热文章列表
export function getPopularArticlesAPI(params) {
  return request({
    url: "/articles-platform/list",
    method: 'GET',
    params: {
      ...params,
      sortBy: 'readCount',     // 按浏览量排序
      sortOrder: 'DESC',
    }
  })
}

// 改-更新文章
export function updateArticleAPI(data) {
  return request({
    url: `/articles-platform/p/${data.id}/edit`,
    method: 'PUT',
    data
  })
}

// 删-删除文章
export function deleteArticleAPI(id) {
  return request({
    url: `/articles-platform/${id}`,
    method: 'DELETE'
  })
}


// 点赞
export function likeArticleAPI(id) {
  return request({
    url: `/articles-platform/p/${id}/like`,
    method: 'POST'
  })
}

// 查询用户是否点赞该文章
export function hasLikedArticleAPI(id) {
  return request({
    url: `/articles-platform/p/${id}/like`,
    method: 'GET'
  })
}


// 保存草稿到后端 (新建或更新)
export function saveDraftAPI(draftData) {
  // 在后端选择：如果文章id存在则更新草稿；若不存在则新建
  return request({
    url: '/articles-platform/drafts',
    method: 'POST',
    data: draftData
  });
}

// 获取用户最新的 "新建文章" 草稿
export function getNewArticleDraftAPI() {
  return request({
    url: '/articles-platform/drafts/latest-new',
    method: 'GET'
  });
}

// 删除指定文章ID关联的草稿 (如果存在)
export function deleteArticleDraftAPI(articleId) {
  return request({
    url: `/articles-platform/articles/${articleId}/draft`,
    method: 'DELETE'
  });
}

// 删除用户的 "新建文章" 草稿
export function deleteNewArticleDraftAPI() {
  return request({
    url: `/articles-platform/drafts/latest-new`,
    method: 'DELETE'
  });
}
