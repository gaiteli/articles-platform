import {request} from '/src/utils';

// 上传附件
export function uploadAttachmentAPI(data) {
  return request({
    url: '/uploads/aliyun',
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