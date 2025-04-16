import {request} from '/src/utils';

// 上传附件
export function uploadAttachmentAPI(data) {
  return request({
    url: '/uploads/aliyun/uploads',
    method: 'POST',
    data,
    params: { type: 'pic' }
  });
}

// 上传文章封面
export function uploadCoverAPI(data) {
  return request({
    url: '/uploads/aliyun/cover',
    method: 'POST',
    data,
    params: { type: 'cover' }
  });
}

// 上传首页背景
export function uploadBgImageAPI(data) {
  return request({
    url: '/uploads/aliyun/background',
    method: 'POST',
    data,
    params: { type: 'bg' }
  });
}

// 获取附件列表
export function getAttachmentsAPI(params) {
  return request({
    url: '/admin/attachments',
    method: 'GET',
    params,
  });
}

// 获取用户上传过的封面图/背景图...
// params: { type: 'pic'/'cover'/'bg'/'avatar' }
export function getMyAttachmentsAPI(params) {
  return request({
    url: '/article-platform/attachments',
    method: 'GET',
    params,
  })
}

// 删除用户自己上传过的附件...
export function deleteMyAttachmentAPI(id) {
  return request({
    url: `/article-platform/attachments/${id}`,
    method: 'DELETE',
  });
}

// 删除附件
export function deleteAttachmentAPI(id) {
  return request({
    url: `/admin/attachments/${id}`,
    method: 'DELETE',
  });
}