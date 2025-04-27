import { request } from "/src/utils";

export function getCaptchaAPI() {
  return request({
    url: "/captcha",
    method: 'GET',
  });
}