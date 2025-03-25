import {request} from '/src/utils';

// 上传附件
export function uploadAttachmentAPI(data) {
  return request({
    url: '/uploads/aliyun/uploads',
    method: 'POST',
    data,
  });
}

// 上传文章封面
export function uploadCoverAPI(data) {
  return request({
    url: '/uploads/aliyun/cover',
    method: 'POST',
    data,
  });
}

// 上传首页背景
export function uploadBgImageAPI(data) {
  return request({
    url: '/uploads/aliyun/background',
    method: 'POST',
    data,
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

// 删除附件
export function deleteAttachmentAPI(id) {
  return request({
    url: `/admin/attachments/${id}`,
    method: 'DELETE',
  });
}