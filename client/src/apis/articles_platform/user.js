// 用户有关的所有请求
import { request } from "/src/utils";

// 提交平台首页背景图更改
export function updateBgImageAPI(params) {
  return request({
    method: 'PUT',
    url: 'users/background',
    data: params
  })
}